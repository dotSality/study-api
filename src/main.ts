import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';

async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UserController(logger),
    new ExceptionFilter(logger)
  );
  await app.init();
}

bootstrap();