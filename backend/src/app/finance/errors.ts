import { AppError } from "../../lib/error/AppError.js";


export const InsufficientBalanceError = new AppError('InsufficientBalance', 409);
export const RestaurantNotFoundError = new AppError('RestaurantNotFound', 404);
export const InsufficientAgentBalanceError = new AppError('InsufficientAgentBalance', 409);
export const AgentNotFoundError = new AppError('AgentNotFound', 404);
