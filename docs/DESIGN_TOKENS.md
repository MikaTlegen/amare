# Дизайн-токены Amare Care

Перенесены из набросков `amare-site` (Vite + Tailwind 3) в `packages/ui`.
Все приложения (site, care, staff) берут цвета, шрифты и базовые стили только отсюда.

## Где что лежит

| Файл | Что внутри |
| --- | --- |
| `packages/ui/src/styles/tokens.css` | палитра RGB-тройками `--c-*`, контрастная тема, `--font-scale` |
| `packages/ui/src/styles/theme.css` | тема Tailwind v4: цвета, шрифты, радиусы, `max-w-content`, `animate-pulse-ring` |
| `packages/ui/src/styles/base.css` | кегль 18px, фокус, `prefers-reduced-motion`, цвет рамок, перенос длинных слов в заголовках, отступ якорей под шапку, запрет горизонтальной прокрутки на телефоне |
| `packages/ui/src/styles/components.css` | `container-content`, `tap-target` (зона нажатия 44px), `gradient-border` |
| `packages/ui/src/tokens/palette.ts` | та же палитра данными (для графиков) и `contrastRatio` |
| `packages/ui/src/tokens/palette.test.ts` | сверка CSS ↔ TS и проверка контраста |
| `packages/ui/src/logo.tsx` | `Logo`, `LogoMark` |
| `packages/ui/assets/amare-logo.svg` | исходник марки |
| `apps/*/app/icon.svg` | favicon |

## Палитра

Взята из фирменного стиля клиники, а не придумана.

| Токен (класс) | Обычная тема | Контрастная | Назначение |
| --- | --- | --- | --- |
| `bg` | `#F3F7F9` | `#FFFFFF` | фон страницы, холодный off-white |
| `surface` | `#FFFFFF` | `#FFFFFF` | карточки, панели |
| `ink` | `#0F1A1F` | `#000000` | основной текст |
| `muted` | `#4C5D66` | `#1A1A1A` | подписи |
| `line` | `#DCE6EA` | `#000000` | рамки, разделители |
| `deep` | `#0B3A4A` | `#04212C` | тёмные панели |
| `deep2` | `#114F66` | `#04212C` | тёмные панели, наведение |
| `brand` | `#06718F` | `#044E64` | голубой логотипа, затемнён — для текста |
| `brand-bright` | `#07ACE7` | `#044E64` | голубая половина сердца на вывеске — для заливок и марки |
| `sky` | `#7FD7F2` | `#AFEAFA` | светлый акцент на тёмном |
| `accent` | `#C8352E` | `#A5221C` | красная половина сердца, затемнена — кнопки, фокус |
| `accent-ink` | `#FFFFFF` | `#FFFFFF` | текст на `accent` |
| `tint` | `#E3F3F9` | `#EAF6FA` | светлые плашки |

Стандартная палитра Tailwind отключена, из неё оставлены только `white` и `black`.
Класс вроде `bg-sky-500` не соберётся: цвета вне бренда в интерфейс не попадут.

## Контраст

Тест требует для обычной темы не меньше 4.5:1 (WCAG AA), для контрастной — не меньше 7:1 (AAA).

| Пара (текст / фон) | Обычная | Контрастная |
| --- | --- | --- |
| ink / bg | 16.4 | 21.0 |
| ink / surface | 17.7 | 21.0 |
| muted / bg | 6.4 | 17.4 |
| muted / surface | 6.9 | 17.4 |
| brand / surface | 5.6 | 9.2 |
| accent-ink / accent | 5.2 | 7.4 |
| white / deep | 12.2 | 16.7 |
| white / deep2 | 9.0 | 16.7 |
| sky / deep | 7.5 | 12.7 |

**Меняете цвет — меняйте его в `tokens.css` и `palette.ts` и прогоняйте:**

```bash
pnpm --filter @amare/ui test
```

Подписи серым и цветные плашки под белым текстом проваливаются первыми.
`brand-bright` (`#07ACE7`) для текста на белом не годится — только заливки и марка.

## Шрифты

- `font-display` — Manrope (заголовки, логотип), `font-sans` — Inter (текст). Кириллица и латиница.
- Подключаются в каждом приложении через `next/font/google` (`app/fonts.ts`). Файлы скачиваются
  при сборке и раздаются с нашего домена — браузер посетителя в Google не обращается.
  Сборка приложения требует доступа к Google Fonts.

## Доступность

- **Базовый кегль 18px** (ТЗ S-13, аудитория старше 55 лет): `html { font-size: calc(18px * var(--font-scale)) }`.
  Вся шкала Tailwind в rem, поэтому `--font-scale` (1 / 1.15 / 1.3) масштабирует интерфейс целиком.
- **Контрастная тема**: атрибут `data-contrast="high"` на `<html>` переопределяет только переменные `--c-*`.
  Компоненты о теме не знают.
- **Фокус** виден всегда: кольцо `accent` с отступом `bg`.
- **`prefers-reduced-motion`** гасит анимации и плавную прокрутку.

Виджет, который переключает масштаб и контраст, — компонент набросков (`AccessibilityMenu`),
он переносится вместе с остальными компонентами.

## Подключение в приложении

```css
/* app/globals.css */
@import "tailwindcss";
@import "@amare/ui/styles.css";
@source "../../../packages/ui/src";
```

```tsx
// app/layout.tsx
import { inter, manrope } from "./fonts";
import "./globals.css";
// <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
```

## Отличия от набросков на Tailwind 3

- Цвет рамки по умолчанию в v4 — `currentColor`; в `base.css` он возвращён к `line`.
- Стандартная палитра Tailwind отключена (в наброске использовался только `white`).
- `Logo` не содержит ссылку: `next/link` добавляет приложение.
- Компонентные классы `container-content` и `gradient-border` — в `styles/components.css` (`@utility`).
- Классы набросков переведены утилитой `@tailwindcss/upgrade` (`shadow-sm`→`shadow-xs`, `backdrop-blur`→`backdrop-blur-sm`,
  `min-h-[3rem]`→`min-h-12` и т. п.). Утилита по ошибке переименовала вариант кнопки `'outline'` в `'outline-solid'` — исправлено.
- **Межстрочный интервал.** В v3 размеры `text-xl…4xl` задавали интервал в rem, `text-5xl+` — 1, и адаптивный
  `sm:text-*` перебивал явный `leading-*`. В v4 интервал — доля от размера, а явный `leading-*` сильнее размерного
  класса. Чтобы вёрстка совпала, в заголовках добавлены адаптивные `sm:leading-*` и `leading-8`.
  В новом коде: если меняете размер на брейкпоинте, задавайте и `leading-*` явно.

## Логотип

Марка одноцветная, цвет задаётся классом (`fill="currentColor"`): `brand-bright` на светлом, белый на тёмном
(`<Logo onDark />`). На вывеске марка двухцветная, но в присланном SVG это один силуэт.
Если у дизайнера есть двухцветный файл — заменить `assets/amare-logo.svg` и пути в `logo.tsx`.
