#!/bin/bash

# Script de deployment para AWS Lightsail/EC2
# Uso: ./deploy-aws.sh tu-ip-de-aws

set -e

SERVER_IP=$1
SERVER_USER="ubuntu"

if [ -z "$SERVER_IP" ]; then
    echo "❌ Error: Debes proporcionar la IP del servidor"
    echo "Uso: ./deploy-aws.sh tu-ip-de-aws"
    exit 1
fi

echo "🚀 Desplegando Emara a AWS..."
echo "📍 Servidor: $SERVER_IP"

# 1. Verificar conexión
echo ""
echo "1️⃣  Verificando conexión SSH..."
ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo '✅ Conexión establecida'" || {
    echo "❌ No se pudo conectar al servidor"
    exit 1
}

# 2. Preparar servidor
echo ""
echo "2️⃣  Preparando servidor..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    # Actualizar sistema
    sudo apt update
    
    # Instalar Docker si no está
    if ! command -v docker &> /dev/null; then
        echo "📦 Instalando Docker..."
        sudo apt install -y docker.io docker-compose git
        sudo usermod -aG docker ubuntu
        sudo systemctl enable docker
        sudo systemctl start docker
    fi
    
    # Crear directorio de trabajo
    mkdir -p ~/emara
ENDSSH

# 3. Sincronizar código
echo ""
echo "3️⃣  Sincronizando código..."
rsync -avz --exclude 'node_modules' \
           --exclude '.git' \
           --exclude 'src/var' \
           --exclude 'src/vendor' \
           --exclude 'backups' \
           ./ $SERVER_USER@$SERVER_IP:~/emara/

# 4. Configurar variables de entorno
echo ""
echo "4️⃣  Configurando variables de entorno..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    cd ~/emara/frontend
    
    # Crear .env.local si no existe
    if [ ! -f .env.local ]; then
        cat > .env.local << 'EOF'
NEXT_PUBLIC_MAGENTO_URL=http://$SERVER_IP
MAGENTO_ADMIN_TOKEN=
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:3001
EOF
        echo "⚠️  Recuerda actualizar MAGENTO_ADMIN_TOKEN en ~/emara/frontend/.env.local"
    fi
ENDSSH

# 5. Levantar servicios
echo ""
echo "5️⃣  Levantando servicios Docker..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    cd ~/emara
    
    # Levantar Magento
    docker-compose down
    docker-compose up -d
    
    # Esperar a que Magento esté listo
    echo "⏳ Esperando a que Magento inicie..."
    sleep 30
    
    # Instalar dependencias del frontend
    cd frontend
    if [ ! -d node_modules ]; then
        docker run --rm -v $(pwd):/app -w /app node:20 npm install
    fi
    
    # Construir frontend
    docker run --rm -v $(pwd):/app -w /app node:20 npm run build
ENDSSH

# 6. Verificar servicios
echo ""
echo "6️⃣  Verificando servicios..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    cd ~/emara
    echo ""
    echo "📊 Estado de contenedores:"
    docker-compose ps
ENDSSH

# 7. Mostrar información
echo ""
echo "✅ ¡Deployment completado!"
echo ""
echo "📍 URLs de acceso:"
echo "   Magento Admin: http://$SERVER_IP/admin_li71oj1"
echo "   Magento GraphQL: http://$SERVER_IP/graphql"
echo "   Frontend: http://$SERVER_IP:3001 (ejecutar manualmente)"
echo "   PHPMyAdmin: http://$SERVER_IP:8080"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Configurar MAGENTO_ADMIN_TOKEN:"
echo "      ssh $SERVER_USER@$SERVER_IP"
echo "      cd ~/emara && ./get-magento-token.sh"
echo ""
echo "   2. Iniciar frontend:"
echo "      ssh $SERVER_USER@$SERVER_IP"
echo "      cd ~/emara/frontend && PORT=3001 npm start"
echo ""
echo "   3. Configurar dominio (opcional):"
echo "      - Apuntar DNS A record a: $SERVER_IP"
echo "      - Configurar SSL con Let's Encrypt"
echo ""
