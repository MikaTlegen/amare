import { common } from "./common";
import { contacts } from "./contacts";
import { footer } from "./footer";
import { meta } from "./meta";
import { nav } from "./nav";
import { ui } from "./ui";

/**
 * Эталонный словарь. Новое пространство имён добавляется здесь — из него
 * выводятся типы всех локалей и его же перебирает тест-сторож.
 */
export const ru = { common, contacts, footer, meta, nav, ui } as const;
