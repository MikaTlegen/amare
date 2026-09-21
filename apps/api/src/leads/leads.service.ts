import { Inject, Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ENV, type Env } from "../config/env";
import type { Lead } from "./lead.schema";

/** Сколько ждём ответа CRM, прежде чем считать её недоступной. */
const REQUEST_TIMEOUT_MS = 10_000;

/** Имя honeypot-поля публичной формы CRM: пустое — значит заявку отправил человек. */
const HONEYPOT_FIELD = "website_url";

/**
 * Поля анкеты, которые публичная форма CRM пока не принимает.
 * Владелец добавляет их в конструкторе формы Tennet, после чего они
 * перестают теряться.
 */
const UNSUPPORTED_FIELDS = ["strokeAgo", "mobility", "filledBy", "utm"] as const;

@Injectable()
export class LeadsService {
  // public: подменяется в тестах, чтобы проверить предупреждение о непринятых полях
  readonly logger = new Logger(LeadsService.name);

  /** Про непринятые поля предупреждаем один раз, а не на каждой заявке. */
  private warnedAboutDroppedFields = false;

  constructor(@Inject(ENV) private readonly env: Env) {}

  /**
   * Передаёт заявку в публичную лид-форму CRM.
   *
   * Браузер шлёт сюда персональные данные и сведения о здоровье, поэтому
   * наружу уходит только то, что форма умеет принять: имя и телефон.
   * Ни в лог, ни в текст ошибки содержимое заявки не попадает.
   */
  async submit(lead: Lead): Promise<{ ok: true }> {
    // Ловушка сработала — молча отвечаем успехом, чтобы бот не понял, что отсеян
    if (lead.websiteUrl) {
      this.logger.warn("Заявка отсеяна ловушкой для ботов");
      return { ok: true };
    }

    this.warnAboutDroppedFields(lead);

    const body = {
      standard_name: lead.name ?? "",
      standard_phone: lead.phone,
      [HONEYPOT_FIELD]: "",
    };

    let response: Response;
    try {
      response = await fetch(this.env.CRM_LEAD_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error: unknown) {
      this.logger.error(`CRM недоступна: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServiceUnavailableException("Не удалось передать заявку");
    }

    if (!response.ok) {
      // Тело ответа CRM может содержать эхо заявки, поэтому в лог идёт только статус
      this.logger.error(`CRM отклонила заявку, статус ${response.status}`);
      throw new ServiceUnavailableException("Не удалось передать заявку");
    }

    this.logger.log(`Заявка передана в CRM, источник: ${lead.source}`);
    return { ok: true };
  }

  /**
   * Данные анкеты, которым сейчас некуда лечь в CRM: теряются — но не молча.
   * Предупреждение одно на запуск: причина у всех заявок одна и та же,
   * и строка в каждом логе только мешала бы читать остальное.
   */
  private warnAboutDroppedFields(lead: Lead): void {
    if (this.warnedAboutDroppedFields) return;

    const dropped = UNSUPPORTED_FIELDS.filter((field) => lead[field] !== undefined);
    if (dropped.length > 0) {
      this.warnedAboutDroppedFields = true;
      this.logger.warn(`Форма CRM не принимает поля: ${dropped.join(", ")} — добавьте их в конструкторе Tennet`);
    }
  }
}
