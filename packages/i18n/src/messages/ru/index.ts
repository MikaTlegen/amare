import { common } from "./common";
import { footer } from "./footer";
import { nav } from "./nav";
import { ui } from "./ui";

/**
 * Эталонный словарь. Новое пространство имён добавляется здесь — из него
 * выводятся типы всех локалей и его же перебирает тест-сторож.
 */
export const ru = { common, footer, nav, ui } as const;
