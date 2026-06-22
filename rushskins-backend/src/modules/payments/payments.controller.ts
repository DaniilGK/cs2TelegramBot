import { Body, Controller, Post } from '@nestjs/common'
import { IsInt, IsString, Max, Min } from 'class-validator'
import { PaymentsService } from './payments.service'

class CreateInvoiceDto {
  @IsString()
  userId!: string

  @IsInt()
  @Min(100)
  @Max(100_000_00)
  amountCents!: number
}

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('telegram/invoice')
  createTelegramInvoice(@Body() body: CreateInvoiceDto) {
    return this.payments.createTopUpInvoice(body)
  }
}

