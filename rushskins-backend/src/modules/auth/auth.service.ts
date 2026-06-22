// src/modules/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { createHmac } from 'crypto'
import { User } from '../users/entities/user.entity'

interface TelegramUserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Верификация подписи Telegram ────────────────────────────────────────
  private verifyInitData(initData: string): TelegramUserData {
    const params = new URLSearchParams(initData)
    const hash   = params.get('hash')

    if (!hash) throw new UnauthorizedException('Нет hash в initData')

    params.delete('hash')

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const botToken  = this.config.get<string>('telegram.botToken')!
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
    const expected  = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (expected !== hash) {
      throw new UnauthorizedException('Невалидная подпись Telegram')
    }

    // Данные не старше 24 часов
    const authDate = Number(params.get('auth_date') ?? 0)
    if (Math.floor(Date.now() / 1000) - authDate > 86_400) {
      throw new UnauthorizedException('initData устарел — открой бота заново')
    }

    const userJson = params.get('user')
    if (!userJson) throw new UnauthorizedException('Нет данных пользователя в initData')

    return JSON.parse(userJson) as TelegramUserData
  }

  // ─── Login / Register ────────────────────────────────────────────────────
  async loginWithTelegram(initData: string) {
    const tgUser = this.verifyInitData(initData)

    // Ищем или создаём пользователя
    let user = await this.users.findOne({
      where: { telegramId: String(tgUser.id) },
    })

    if (!user) {
      user = this.users.create({
        telegramId: String(tgUser.id),
        username:   tgUser.username,
        firstName:  tgUser.first_name,
        lastName:   tgUser.last_name,
        avatarUrl:  tgUser.photo_url,
      })
      await this.users.save(user)
    } else {
      // Обновляем данные профиля при каждом входе
      user.username  = tgUser.username  ?? user.username
      user.firstName = tgUser.first_name
      user.lastName  = tgUser.last_name  ?? user.lastName
      user.avatarUrl = tgUser.photo_url  ?? user.avatarUrl
      await this.users.save(user)
    }

    const token = this.jwt.sign({ sub: user.id, telegramId: user.telegramId })

    return { token, user }
  }

  // ─── Получить себя по ID из JWT ──────────────────────────────────────────
  async getMe(userId: string): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } })
    if (!user) throw new UnauthorizedException('Пользователь не найден')
    return user
  }
}
