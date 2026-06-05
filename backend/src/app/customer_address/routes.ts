import { Router } from 'express';
import { authenticate } from '../../lib/auth/guard.js';
import {container} from '../../lib/di/container.js'
import { TOKENS } from '../../lib/di/tokens.js';
import { CustomerAddressController } from './controller/customer_address.controller.js';

export const customerAddressRouter = Router();

const customerAddressController = container.resolve<CustomerAddressController>(TOKENS.CustomerAddressController);

customerAddressRouter.get('/', authenticate, customerAddressController.getAll);
customerAddressRouter.post('/', authenticate, customerAddressController.create);
customerAddressRouter.patch('/:addressId', authenticate, customerAddressController.update);
customerAddressRouter.delete('/:addressId', authenticate, customerAddressController.remove);
