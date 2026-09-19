'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { Button as UiButton } from '@amare/ui'
import { useLocale } from '@amare/i18n/react'
import { localeHref } from '@amare/i18n/locales'

/**
 * Ссылки, знающие про язык страницы.
 *
 * Казахская версия живёт под /kk/, поэтому ссылка с href={ROUTES.team}
 * внутри казахской страницы обязана вести на /kk/vrachi — иначе первый же
 * клик выбрасывает человека обратно в русскую версию.
 *
 * Префикс добавляется здесь, а не в каждом вызове: адреса в компонентах
 * остаются прежними (ROUTES.x), меняется только строка импорта. Локаль
 * берётся из контекста @amare/i18n, который ставит макет страницы;
 * без провайдера контекст отдаёт русский, то есть адрес не меняется.
 *
 * Прямой импорт next/link в components/ запрещён — сторожит i18n-rules.test.ts.
 */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale()
  return <NextLink href={typeof href === 'string' ? localeHref(locale, href) : href} {...rest} />
}

/** Кнопка-ссылка из @amare/ui с тем же правилом префикса. */
export function Button(props: ComponentProps<typeof UiButton>) {
  const locale = useLocale()

  if ('to' in props && props.to) {
    return <UiButton {...props} to={localeHref(locale, props.to)} />
  }
  return <UiButton {...props} />
}
