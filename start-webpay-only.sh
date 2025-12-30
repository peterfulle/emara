#!/bin/bash

# Script para iniciar solo el servidor Webpay Plus

echo "🚀 Iniciando servidor Webpay Plus..."

cd "$(dirname "$0")/webpay-server"

# Verificar entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip install -q -r requirements.txt

# Verificar .env
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Archivo .env creado. Configura tus credenciales."
fi

# Iniciar servidor
echo "✅ Iniciando servidor en puerto 5001..."
python app.py
