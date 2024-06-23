import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (Array.isArray(exception.response.message)) {
      return response.status(status).json({
        message: exception.response?.message[0],
        status: false,
      });
    }
    response.status(status).json({
      message: exception.response?.message,
      status: false,
    });
  }
}
