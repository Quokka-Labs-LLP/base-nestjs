/**
 *
 */
export interface ResponseInterface {
  success: boolean;
  httpStatusCode?: number; // Explicitly set an HTTP response status code
  code?: number;
  data?: object;
  message?: string;
}
