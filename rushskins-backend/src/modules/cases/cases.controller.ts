import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsInt, Max, Min } from 'class-validator'
import { CasesService } from './cases.service'
import { User } from '../users/entities/user.entity'

class OpenCaseDto {
  @IsInt()
  @Min(1)
  @Max(10)
  quantity!: number
}

@Controller('api/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  getAllCases() {
    return this.casesService.getAllCases()
  }

  @Get(':id')
  getCaseWithItems(@Param('id') id: string) {
    return this.casesService.getCaseWithItems(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/open')
  openCase(
    @Param('id') id: string,
    @Body() body: OpenCaseDto,
    @Req() req: { user: User },
  ) {
    return this.casesService.openCase(req.user.id, id, body.quantity)
  }
}
