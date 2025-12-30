#!/bin/bash

# Script para iniciar el servidor de Webpay Plus Python

echo "================================================"
echo "  Iniciando Servidor Webpay Plus (Python)"
echo "================================================"

cd "$(dirname "$0")/webpay-server"

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "❌ Entorno virtual no encontrado."
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
    
    if [ $? -ne 0 ]; then
        echo "❌ Error al crear entorno virtual"
        exit 1
    fi
    
    echo "✅ Entorno virtual creado"
fi

# Activar entorno virtual
echo "🔄 Activando entorno virtual..."
source venv/bin/activate

# Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
pip install -q -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"

# Verificar archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📝 Copiando .env.example a .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo "⚠️  Por favor, configura tus credenciales en .env"
fi

echo ""
echo "================================================"
echo "  🚀 Iniciando servidor..."
echo "================================================"
echo ""

# Iniciar servidor
python app.py
