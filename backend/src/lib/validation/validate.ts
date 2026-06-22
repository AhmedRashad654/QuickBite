import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '../error/AppError.js';

function formatErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...formatErrors(error.children));
    }
  }

  return messages;
}

export async function validateBody<T extends Object>(cls: new () => T, body: unknown): Promise<T> {
  const instance = plainToInstance(cls, body);
  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (errors.length > 0) {
    const errorMessages = formatErrors(errors);
    throw new AppError(errorMessages.join('\n'), 400);
  }

  return instance;
}
