from flask import Flask, request, jsonify
from flask_cors import CORS
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.common.options import WebpayOptions
import os
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración de Transbank
# Por defecto usar integración para testing
COMMERCE_CODE = os.getenv('TRANSBANK_COMMERCE_CODE', '597055555532')
API_KEY = os.getenv('TRANSBANK_API_KEY', '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C')
ENVIRONMENT = os.getenv('TRANSBANK_ENVIRONMENT', 'INTEGRACION')

# URL de retorno
BASE_URL = os.getenv('BASE_URL', 'http://localhost:3001')

# Crear opciones de configuración para Transbank
webpay_options = WebpayOptions(COMMERCE_CODE, API_KEY, IntegrationType.TEST)

print(f"\n{'='*60}")
print(f"  Webpay Plus Python Server - Inicializando")
print(f"{'='*60}")
print(f"  Ambiente: {ENVIRONMENT}")
print(f"  Código de comercio: {COMMERCE_CODE}")
print(f"  Base URL: {BASE_URL}")
print(f"{'='*60}\n")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'Webpay Plus Python Server',
        'environment': ENVIRONMENT,
        'commerce_code': COMMERCE_CODE
    })

@app.route('/webpay/create', methods=['POST'])
def create_transaction():
    """
    Crea una nueva transacción de Webpay Plus
    
    Body esperado:
    {
        "orderId": "order_123",
        "amount": 10000,
        "buyOrder": "ORDER-12345",
        "returnUrl": "http://localhost:3001/checkout/webpay/return"
    }
    """
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        order_id = data.get('orderId')
        amount = data.get('amount')
        buy_order = data.get('buyOrder')
        return_url = data.get('returnUrl', f'{BASE_URL}/checkout/webpay/return')
        
        if not all([order_id, amount, buy_order]):
            return jsonify({
                'error': 'Missing required fields',
                'required': ['orderId', 'amount', 'buyOrder']
            }), 400
        
        # Validar que el monto sea un número válido
        try:
            amount = int(amount)
            if amount <= 0:
                raise ValueError("Amount must be positive")
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid amount'}), 400
        
        # Crear sesión única
        session_id = f"session_{order_id}_{datetime.now().timestamp()}"
        
        # Transbank limita buy_order a 26 caracteres máximo
        # Acortamos el buy_order si es necesario
        buy_order_short = str(buy_order)[:26]
        
        print(f"Creating Webpay transaction:")
        print(f"  Buy Order (original): {buy_order}")
        print(f"  Buy Order (shortened): {buy_order_short}")
        print(f"  Session ID: {session_id}")
        print(f"  Amount: ${amount} CLP")
        print(f"  Return URL: {return_url}")
        
        # Crear la transacción usando el API del SDK
        tx = Transaction(webpay_options)
        response = tx.create(
            buy_order=buy_order_short,
            session_id=str(session_id)[:61],  # También limitamos session_id a 61 chars
            amount=amount,
            return_url=str(return_url)
        )
        
        print(f"Transaction created successfully:")
        print(f"  Token: {response['token']}")
        print(f"  URL: {response['url']}")
        
        return jsonify({
            'success': True,
            'url': response['url'],
            'token': response['token'],
            'buyOrder': buy_order,
            'amount': amount
        }), 200
        
    except Exception as e:
        print(f"Error creating transaction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to create transaction',
            'details': str(e)
        }), 500

@app.route('/webpay/commit', methods=['POST'])
def commit_transaction():
    """
    Confirma una transacción de Webpay Plus
    
    Body esperado:
    {
        "token": "token_ws_xxxxx"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        print(f"Committing transaction with token: {token}")
        
        # Confirmar la transacción usando el SDK
        tx = Transaction(webpay_options)
        response = tx.commit(token=str(token))
        
        print(f"Transaction committed:")
        print(f"  Response Code: {response['response_code']}")
        print(f"  Authorization Code: {response.get('authorization_code', 'N/A')}")
        print(f"  Amount: ${response['amount']} CLP")
        print(f"  Buy Order: {response['buy_order']}")
        
        # Determinar si el pago fue exitoso
        is_approved = response['response_code'] == 0
        
        card_detail = response.get('card_detail', {})
        
        result = {
            'success': is_approved,
            'vci': response.get('vci'),
            'amount': response['amount'],
            'status': response.get('status'),
            'buyOrder': response['buy_order'],
            'sessionId': response['session_id'],
            'cardDetail': {
                'cardNumber': card_detail.get('card_number') if card_detail else None
            },
            'accountingDate': response.get('accounting_date'),
            'transactionDate': response.get('transaction_date'),
            'authorizationCode': response.get('authorization_code'),
            'paymentTypeCode': response.get('payment_type_code'),
            'responseCode': response['response_code'],
            'installmentsNumber': response.get('installments_number', 0)
        }
        
        if is_approved:
            print("✓ Payment approved successfully")
            result['message'] = 'Pago aprobado exitosamente'
        else:
            print(f"✗ Payment rejected with code: {response['response_code']}")
            result['message'] = 'Pago rechazado'
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error committing transaction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'Failed to commit transaction',
            'details': str(e)
        }), 500

@app.route('/webpay/status', methods=['GET'])
def get_status():
    """
    Obtiene el estado de una transacción (usando el token)
    Query param: token
    """
    try:
        token = request.args.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        # Confirmar la transacción para obtener su estado
        tx = Transaction(webpay_options)
        response = tx.commit(token=str(token))
        
        is_approved = response['response_code'] == 0
        
        return jsonify({
            'success': is_approved,
            'responseCode': response['response_code'],
            'authorizationCode': response.get('authorization_code'),
            'amount': response['amount'],
            'buyOrder': response['buy_order'],
            'status': 'approved' if is_approved else 'rejected'
        }), 200
        
    except Exception as e:
        print(f"Error getting status: {str(e)}")
        return jsonify({
            'error': 'Failed to get status',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    print(f"\n{'='*60}")
    print(f"  Webpay Plus Python Server")
    print(f"{'='*60}")
    print(f"  Environment: {ENVIRONMENT}")
    print(f"  Commerce Code: {COMMERCE_CODE}")
    print(f"  Port: {port}")
    print(f"  Debug: {debug}")
    print(f"  Base URL: {BASE_URL}")
    print(f"{'='*60}\n")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
