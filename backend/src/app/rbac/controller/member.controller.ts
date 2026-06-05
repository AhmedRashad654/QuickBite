import { Response, Request } from 'express';
import { validateBody } from '../../../lib/validation/validate.js';
import { CreateMemberDTO, UpdateMemberBranchesDTO, UpdateMemberDTO } from '../dto/member.dto.js';
import { MemberService } from '../service/member.service.js';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { sendSuccess } from '../../../lib/http/response.js';

@injectable()
export class MemberController {
  constructor(@inject(TOKENS.MemberService) private readonly memberService: MemberService) {}

  createMember = async (req: Request, res: Response) => {
    const data = await validateBody(CreateMemberDTO, req.body);
    const result = await this.memberService.createMember(Number(req.params.restaurantId), data);
    sendSuccess(res, result, 201);
  };

  listMembers = async (req: Request, res: Response) => {
    const result = await this.memberService.listMembers(Number(req.params.restaurantId));
    sendSuccess(res, result);
  };

  updateMember = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateMemberDTO, req.body);
    const result = await this.memberService.updateMember(
      Number(req.params.restaurantId),
      Number(req.params.memberId),
      data,
    );
    sendSuccess(res, result);
  };

  deleteMember = async (req: Request, res: Response) => {
    const result = await this.memberService.deleteMember(Number(req.params.restaurantId), Number(req.params.memberId));
    sendSuccess(res, result);
  };

  updateMemberBranches = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateMemberBranchesDTO, req.body);
    const result = await this.memberService.updateMemberBranches(
      Number(req.params.restaurantId),
      Number(req.params.memberId),
      data,
    );
    sendSuccess(res, result);
  };

  getRolePermissions = async (req: Request, res: Response) => {
    const result = await this.memberService.getRolePermissions(req.params.role as string);
    sendSuccess(res, result);
  };
}
