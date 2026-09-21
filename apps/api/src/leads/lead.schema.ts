import { z } from "zod";

/**
 * Заявка с сайта. Валидируется на границе: браузеру не верим.
 *
 * Состав полей повторяет LeadPayload сайта (apps/site/lib/crm.ts), а имена
 * значений — опции полей лида в CRM, чтобы не заводить таблицу перевода.
 */
export const leadSchema = z.object({
  filledBy: z.enum(["patient", "relative"]),
  strokeAgo: z.enum(["<1m", "1-6m", "6-12m", ">12m"]).optional(),
  mobility: z.enum(["bedridden", "wheelchair", "assisted", "independent"]).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().min(5).max(30),
  source: z.enum(["quiz", "form", "callback", "booking"]),
  utm: z.record(z.string().max(60), z.string().max(200)).optional(),
  // Сведения о здоровье — особая категория ПД (раздел 4 ТЗ): без согласия заявку не принимаем
  consent: z.literal(true),
  // Ловушка для ботов: люди это поле не видят и не заполняют
  websiteUrl: z.string().max(200).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
