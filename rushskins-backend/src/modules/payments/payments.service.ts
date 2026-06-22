import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

interface TelegramResponse<T> {
  ok: boolean
  result?: T
  description?: string
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async createTopUpInvoice(input: { userId: string; amountCents: number }) {
    const botToken = this.config.get<string>('telegram.botToken')
    const providerToken = this.config.get<string>('telegram.providerToken')

    if (!botToken) throw new InternalServerErrorException('TELEGRAM_BOT_TOKEN is not configured')
    if (!providerToken) throw new InternalServerErrorException('TELEGRAM_PAYMENT_PROVIDER_TOKEN is not configured')

    const amountCents = Number(input.amountCents)
    if (!Number.isInteger(amountCents) || amountCents < 100 || amountCents > 100_000_00) {
      throw new BadRequestException('amountCents must be between 100 and 10000000')
    }

    const payload = JSON.stringify({
      type: 'balance_topup',
      userId: input.userId,
      amountCents,
      createdAt: Date.now(),
    })

    const { data } = await firstValueFrom(
      this.http.post<TelegramResponse<string>>(
        `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
        {
          title: 'RushSkins balance top-up',
          description: `Deposit $${(amountCents / 100).toFixed(2)} to your RushSkins balance`,
          payload,
          provider_token: providerToken,
          currency: 'USD',
          prices: [{ label: 'Balance top-up', amount: amountCents }],
        },
      ),
    )

    if (!data.ok || !data.result) {
      throw new InternalServerErrorException(data.description ?? 'Telegram invoice creation failed')
    }

    return {
      invoiceLink: data.result,
      amountCents,
    }
  }
}

