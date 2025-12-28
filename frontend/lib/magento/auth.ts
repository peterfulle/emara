/**
 * Autenticación con Magento REST API
 * Este módulo maneja la obtención y caché de tokens de admin
 */

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Obtener token de admin de Magento
 * El token es válido por 4 horas por defecto en Magento 2
 */
export async function getMagentoAdminToken(): Promise<string> {
  // Verificar si tenemos un token en caché y aún es válido
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    console.log('Using cached Magento admin token');
    return tokenCache.token;
  }

  const username = process.env.MAGENTO_ADMIN_USERNAME;
  const password = process.env.MAGENTO_ADMIN_PASSWORD;
  const baseUrl = process.env.NEXT_PUBLIC_MAGENTO_BASE_URL || 'http://localhost';

  if (!username || !password) {
    throw new Error(
      'Magento admin credentials not configured. Set MAGENTO_ADMIN_USERNAME and MAGENTO_ADMIN_PASSWORD in .env.local'
    );
  }

  try {
    console.log('Requesting new Magento admin token...');
    
    const response = await fetch(`${baseUrl}/rest/V1/integration/admin/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get Magento admin token: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const token = await response.json();
    
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token response from Magento');
    }

    // Cachear el token por 3.5 horas (por seguridad, menos que las 4 horas de Magento)
    const expiresIn = 3.5 * 60 * 60 * 1000; // 3.5 horas en milisegundos
    tokenCache = {
      token,
      expiresAt: Date.now() + expiresIn,
    };

    console.log('✅ Magento admin token obtained successfully');
    return token;
  } catch (error) {
    console.error('❌ Error getting Magento admin token:', error);
    throw error;
  }
}

/**
 * Invalidar el token en caché (útil si el token expira antes de tiempo)
 */
export function invalidateTokenCache(): void {
  tokenCache = null;
  console.log('Magento token cache invalidated');
}

/**
 * Hacer una petición autenticada a la REST API de Magento
 */
export async function magentoAuthenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getMagentoAdminToken();
  const baseUrl = process.env.NEXT_PUBLIC_MAGENTO_BASE_URL || 'http://localhost';
  
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Si obtenemos 401, el token puede haber expirado
  if (response.status === 401) {
    console.log('Token expired, invalidating cache and retrying...');
    invalidateTokenCache();
    
    // Reintentar con un nuevo token
    const newToken = await getMagentoAdminToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return response;
}
