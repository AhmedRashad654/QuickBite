import { Request, Response } from 'express';
import { ProductService } from '../service/product.service.js';
import { CreateProductDTO, UpdateProductBranchDTO, UpdateProductDTO } from '../dto/product.dto.js';
import { validateBody } from '../../../lib/validation/validate.js';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { sendSuccess } from '../../../lib/http/response.js';

@injectable()
export class ProductController {
  constructor(@inject(TOKENS.ProductService) private readonly productService: ProductService) {}

  create = async (req: Request, res: Response) => {
    const data = await validateBody(CreateProductDTO, req.body);
    const product = await this.productService.create(Number(req.params.restaurantId), data);
    sendSuccess(res, product, 'Product created', 201);
  };

  findByRestaurant = async (req: Request, res: Response) => {
    const results = await this.productService.findByRestaurant(Number(req.params.restaurantId));
    sendSuccess(res, results);
  };

  findCategories = async (req: Request, res: Response) => {
    const results = await this.productService.findCategories(Number(req.params.restaurantId));
    sendSuccess(res, results);
  };

  findByBranch = async (req: Request, res: Response) => {
    const results = await this.productService.findByBranch(Number(req.params.branchId));
    sendSuccess(res, results);
  };

  findByBranchForRestaurantUser = async (req: Request, res: Response) => {
    const results = await this.productService.findByBranchForRestaurantUser(Number(req.params.branchId));
    sendSuccess(res, results);
  };

  findById = async (req: Request, res: Response) => {
    const product = await this.productService.findById(Number(req.params.id));
    sendSuccess(res, product);
  };

  update = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateProductDTO, req.body);
    const result = await this.productService.update(
      Number(req.params.productId),
      Number(req.params.restaurantId),
      data,
    );
    sendSuccess(res, result, 'Product updated');
  };

  updateProductBranch = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateProductBranchDTO, req.body);
    const result = await this.productService.updateProductBranch(
      Number(req.params.productId),
      Number(req.params.branchId),
      data,
    );
    sendSuccess(res, result, 'Product updated');
  };
}
