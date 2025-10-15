import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * This class catches all errors that happen in the app.
 * It helps to return a clear and formatted message to the client.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * This method runs when an error happens.
   * @param exception - The error or exception that was thrown.
   * @param host - The current request context (it gives access to the request and response).
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Get the HTTP context (request and response objects)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // If the error is an HttpException, get its status code.
    // If not, set the status code to 500 (server error).
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // Get the error message.
    // If the error is an HttpException, get the message from it.
    // Otherwise, use a default message.
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Send the response back to the client with the status code and message.
    response.status(status).json({ statusCode: status, message });
  }
}
