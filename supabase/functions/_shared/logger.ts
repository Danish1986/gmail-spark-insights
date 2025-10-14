const isProd = Deno.env.get('ENVIRONMENT') === 'production';

function redactSensitive(data: any): any {
  if (!data) return data;
  
  const safe = JSON.parse(JSON.stringify(data));
  
  // Redact token fields
  if (safe.access_token) safe.access_token = '[REDACTED]';
  if (safe.refresh_token) safe.refresh_token = '[REDACTED]';
  if (safe.provider_token) safe.provider_token = '[REDACTED]';
  
  return safe;
}

export const safeLog = {
  info: (msg: string, data?: any) => {
    if (isProd && data) {
      console.log(msg, redactSensitive(data));
    } else {
      console.log(msg, data);
    }
  },
  
  error: (msg: string, error?: any) => {
    const errorMsg = error?.message || error;
    console.error(msg, errorMsg);
  },
  
  debug: (msg: string, data?: any) => {
    if (!isProd) {
      console.log(`[DEBUG] ${msg}`, data);
    }
  }
};
