import type { Namespace, Translation } from "../../types";
import { booking } from "./booking";
import { common } from "./common";
import { contacts } from "./contacts";
import { course } from "./course";
import { directions } from "./directions";
import { doctors } from "./doctors";
import { faq } from "./faq";
import { footer } from "./footer";
import { forms } from "./forms";
import { home } from "./home";
import { knowledge } from "./knowledge";
import { legal } from "./legal";
import { meta } from "./meta";
import { nav } from "./nav";
import { prices } from "./prices";
import { progress } from "./progress";
import { quiz } from "./quiz";
import { remote } from "./remote";
import { pages } from "./pages";
import { reviews } from "./reviews";
import { stories } from "./stories";
import { ui } from "./ui";

/**
 * Казахский словарь. Частичный: пропущенный ключ откатывается на русский,
 * поэтому наполнять его можно по частям, не ломая страницы.
 *
 * Тип перебирает все пространства имён эталона: забыть завести казахский
 * файл для нового namespace не даст компилятор.
 */
export const kk: { [N in Namespace]: Translation<N> } = {
  booking,
  common,
  contacts,
  course,
  directions,
  doctors,
  faq,
  footer,
  forms,
  home,
  knowledge,
  legal,
  meta,
  nav,
  pages,
  prices,
  progress,
  quiz,
  remote,
  reviews,
  stories,
  ui,
};
