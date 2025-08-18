export const logger = {
  info: (message: string, data?: any) => console.log(message, data),
  warn: (message: string, data?: any) => console.warn(message, data),
  error: (message: string, error?: Error, data?: any) => console.error(message, error, data),
  debug: (message: string, data?: any) => console.debug(message, data),
  apiRequest: (method: string, url: string, data?: any, options?: any) => console.log(`[API] ${method} ${url}`, data),
  apiResponse: (method: string, url: string, status: number, data?: any, options?: any) => console.log(`[API] ${method} ${url} ${status}`, data),
  apiError: (method: string, url: string, error: Error, options?: any) => console.error(`[API] ${method} ${url}`, error)
};