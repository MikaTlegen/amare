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
 * Эталонный словарь. Новое пространство имён добавляется здесь — из него
 * выводятся типы всех локалей и его же перебирает тест-сторож.
 */
export const ru = {
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
} as const;
