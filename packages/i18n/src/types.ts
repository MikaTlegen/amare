import type { ru } from "./messages/ru";

/**
 * Типы словаря.
 *
 * Русский словарь — эталон: набор пространств имён и набор ключей в каждом
 * задаёт он. Остальные локали описываются как Partial от него, поэтому
 * пропущенный ключ разрешён (сработает откат на русский), а опечатка или
 * лишний ключ — ошибка компиляции, а не сюрприз в проде.
 */
export type Namespaces = typeof ru;
export type Namespace = keyof Namespaces & string;
export type Messages<N extends Namespace> = Namespaces[N];

/** Значения, которые можно подставить в {плейсхолдер}. */
export type Vars = Record<string, string | number>;

/** Ключи с одной строкой — их читает t(). */
export type MessageKey<N extends Namespace> = {
  [K in keyof Messages<N>]: Messages<N>[K] extends string ? K : never;
}[keyof Messages<N>] &
  string;

/** Ключи со списком строк (тезисы статьи, пункты программы) — их читает getList(). */
export type ListKey<N extends Namespace> = {
  [K in keyof Messages<N>]: Messages<N>[K] extends readonly string[] ? K : never;
}[keyof Messages<N>] &
  string;

/**
 * Основа ключа с формами числа: «файл / файла / файлов» лежат как
 * `files.one`, `files.few`, `files.many`, а код просит просто `files`.
 */
export type PluralKey<N extends Namespace> = {
  [K in keyof Messages<N>]: K extends `${infer Base}.one` ? Base : never;
}[keyof Messages<N>] &
  string;

/** Словарь неэталонной локали. */
export type Translation<N extends Namespace> = Partial<{
  [K in keyof Messages<N>]: Messages<N>[K] extends readonly string[] ? readonly string[] : string;
}>;

/** Набор словарей, переданный клиентскому провайдеру. */
export type ProvidedMessages = Partial<{ [N in Namespace]: Messages<N> }>;
