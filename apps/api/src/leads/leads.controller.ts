import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { leadSchema } from "./lead.schema";
import { LeadsService } from "./leads.service";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /**
   * Приём заявки с сайта и передача её в CRM.
   *
   * Тело приходит из браузера, поэтому сначала проверяется схемой: в ошибке
   * только имена полей, без присланных значений — там персональные данные.
   */
  @Post()
  @HttpCode(202)
  async create(@Body() body: unknown): Promise<{ ok: true }> {
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const names = [...new Set(parsed.error.issues.map((issue) => issue.path.join(".")))].join(", ");
      throw new BadRequestException(`Некорректные поля заявки: ${names}`);
    }

    return this.leads.submit(parsed.data);
  }
}
