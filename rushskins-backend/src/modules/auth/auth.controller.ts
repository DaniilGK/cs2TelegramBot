// src/modules/auth/auth.controller.ts

import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsNotEmpty, IsString } from 'class-validator'
import { AuthService } from './auth.service'

class TelegramAuthDto {
  @IsString()
  @IsNotEmpty()
  initData!: string
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // POST /api/auth/telegram  — фронт шлёт initData, получает JWT + user
  @Post('telegram')
  login(@Body() body: TelegramAuthDto) {
    return this.auth.loginWithTelegram(body.initData)
  }

  // GET /api/auth/me  — требует Bearer токен
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: any) {
    return req.user
  }
}
