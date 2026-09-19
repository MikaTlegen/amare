import type { Namespace, Translation } from "../../types";
import { common } from "./common";
import { contacts } from "./contacts";
import { footer } from "./footer";
import { meta } from "./meta";
import { nav } from "./nav";
import { ui } from "./ui";

/**
 * Казахский словарь. Частичный: пропущенный ключ откатывается на русский,
 * поэтому наполнять его можно по частям, не ломая страницы.
 *
 * Тип перебирает все пространства имён эталона: забыть завести казахский
 * файл для нового namespace не даст компилятор.
 */
export const kk: { [N in Namespace]: Translation<N> } = { common, contacts, footer, meta, nav, ui };
