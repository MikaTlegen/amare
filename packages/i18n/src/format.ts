/** Плейсхолдер вида {name}. Значения приходят из кода, не из адреса страницы. */
const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * Подстановка значений в строку перевода.
 *
 * Неизвестное имя остаётся как есть: «{count}» в интерфейсе заметно сразу,
 * а молча подставленная пустота — нет.
 */
export function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;

  return template.replace(PLACEHOLDER, (whole, name: string) => {
    const value = vars[name];
    return value === undefined ? whole : String(value);
  });
}

/** Формы числа в порядке подбора: если нужной в словаре нет, берём следующую. */
export const PLURAL_FORMS = ["one", "few", "many", "other"] as const;
export type PluralForm = (typeof PLURAL_FORMS)[number];

const rules = new Map<string, Intl.PluralRules>();

/**
 * Форма слова по числу.
 *
 * Считает Intl, а не наши ветвления: в русском форм три, в казахском одна,
 * и написанное руками правило разъехалось бы на первой же новой локали.
 */
export function pluralForm(locale: string, count: number): PluralForm {
  let rule = rules.get(locale);
  if (!rule) {
    rule = new Intl.PluralRules(locale);
    rules.set(locale, rule);
  }

  const category = rule.select(count);
  return (PLURAL_FORMS as readonly string[]).includes(category) ? (category as PluralForm) : "other";
}
