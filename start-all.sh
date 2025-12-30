#!/bin/bash

# Script para iniciar toda la aplicación Emara con Webpay Plus

echo "================================================"
echo "  🚀 Iniciando EMARA E-Commerce"
echo "================================================"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "================================================"
    echo "  🛑 Deteniendo servidores..."
    echo "================================================"
    kill $WEBPAY_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# 1. Iniciar servidor Webpay Plus (Python)
echo "1️⃣  Iniciando servidor Webpay Plus (Python)..."
cd "$(dirname "$0")/webpay-server"

if [ ! -d "venv" ]; then
    echo "   📦 Creando entorno virtual..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ⚠️  Configurar credenciales en webpay-server/.env"
fi

python app.py > ../logs/webpay.log 2>&1 &
WEBPAY_PID=$!
echo "   ✅ Webpay server iniciado (PID: $WEBPAY_PID) en puerto 5001"
deactivate
cd ..

sleep 2

# 2. Iniciar frontend Next.js
echo ""
echo "2️⃣  Iniciando frontend Next.js..."
cd frontend
PORT=3001 npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend iniciado (PID: $FRONTEND_PID) en puerto 3001"
cd ..

echo ""
echo "================================================"
echo "  ✅ Aplicación iniciada correctamente"
echo "================================================"
echo ""
echo "  📍 URLs disponibles:"
echo "     Frontend:        http://localhost:3001"
echo "     Webpay Server:   http://localhost:5001"
echo "     Health Check:    http://localhost:5001/health"
echo ""
echo "  📝 Logs disponibles en:"
echo "     Webpay:  logs/webpay.log"
echo "     Frontend: logs/frontend.log"
echo ""
echo "  ⚠️  Presiona Ctrl+C para detener todos los servidores"
echo "================================================"
echo ""

# Mantener el script corriendo
wait
