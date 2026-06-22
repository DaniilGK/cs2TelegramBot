// src/modules/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'

interface JwtPayload {
  sub: string        // user.id
  telegramId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:      config.get<string>('jwt.secret')!,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.users.findOne({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException('Пользователь не найден')
    return user  // будет доступен как req.user в контроллерах
  }
}
