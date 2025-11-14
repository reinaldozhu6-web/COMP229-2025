export async function apiRequest(path, options = {}) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body !== undefined) {
    config.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody === 'object') {
        message = errorBody.message || errorBody.error?.message || message;
      }
    } catch (error) {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
