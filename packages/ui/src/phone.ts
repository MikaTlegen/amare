/**
 * Маска казахстанского мобильного номера: +7 (7XX) XXX-XX-XX.
 *
 * Ведущую «7»/«8» (код страны или старый межгород) отбрасываем — она уже
 * есть в маске как «+7», иначе после форматирования цифры съезжают на
 * одну позицию и номер получается с ошибкой.
 */
export function formatKzPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8") || digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  if (digits.length === 0) return "";
  let result = "+7 (" + digits.slice(0, 3);
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += " " + digits.slice(3, 6);
  if (digits.length > 6) result += "-" + digits.slice(6, 8);
  if (digits.length > 8) result += "-" + digits.slice(8, 10);
  return result;
}
