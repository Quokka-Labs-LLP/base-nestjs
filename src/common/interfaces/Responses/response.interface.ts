/**
 *
 */
export interface ResponseInterface {
  success?: boolean;
  status?: number;
  message?: string;
  data?: object;
  metadata?: object;
}
