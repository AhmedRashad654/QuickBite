import { AppError } from "../../lib/error/AppError.js";

export const BranchNotFoundError = new AppError('Branch not found', 404);
export const NoFieldsToUpdateError = new AppError('No valid fields to update', 400);