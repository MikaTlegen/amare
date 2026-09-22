import type { ReactNode } from 'react'
import { getList, getT, type Locale } from '@amare/i18n'
import { CLINIC } from '@/lib/clinic'

/**
 * Политика обработки персональных данных (S-10 ТЗ).
 *
 * Страница серверная и намеренно без фотообложки: это документ, который
 * читают, а не разглядывают. Ширина текста ограничена max-w-3xl — иначе на
 * мониторе строка уезжает за комфортные ~75 знаков.
 *
 * Текст целиком в словаре privacy, здесь только порядок разделов и
 * подстановка реквизитов. Реквизиты берутся из lib/clinic.ts и словаря
 * contacts: расходиться с контактами и разметкой клиники им нельзя.
 *
 * БИН выводится, только если он заполнен. Пока CLINIC.bin пуст, строка
 * не рисуется: пустой реквизит в юридическом документе хуже его отсутствия.
 */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'privacy')
  const contacts = getT(locale, 'contacts')
  const phone = CLINIC.phones[0].label

  return (
    <article className="container-content flex max-w-3xl flex-col gap-10 py-16">
      <header className="flex flex-col gap-4">
        <h1 className="m-0 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {t('cover.title')}
        </h1>
        <p className="m-0 text-base text-muted">{t('updated')}</p>
        <p className="m-0 text-lg leading-relaxed">{t('cover.note')}</p>

        {/* Тело документа на казахском откатывается на русский — честнее
            сказать об этом прямо, чем выдать откат за перевод */}
        {locale !== 'ru' && (
          <p className="m-0 rounded-2xl border border-line bg-tint p-4 text-base leading-relaxed text-deep">
            {t('translationNotice')}
          </p>
        )}
      </header>

      <Section title={t('operator.title')}>
        <p className="m-0">{t('operator.body', { legalName: contacts('legalName') })}</p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {CLINIC.bin && <li>{t('operator.bin', { bin: CLINIC.bin })}</li>}
          <li>{t('operator.address', { address: contacts('addressFull') })}</li>
          <li>{t('operator.phone', { phone })}</li>
        </ul>
      </Section>

      <Section title={t('collect.title')}>
        <p className="m-0">{t('collect.sent.lead')}</p>
        <Bullets items={getList(locale, 'privacy', 'collect.sent')} />
        <p className="m-0">{t('collect.local.lead')}</p>
        <p className="m-0">{t('collect.tech.lead')}</p>
      </Section>

      <Section title={t('purpose.title')}>
        <p className="m-0">{t('purpose.lead')}</p>
        <Bullets items={getList(locale, 'privacy', 'purpose.list')} />
        <p className="m-0">{t('purpose.note')}</p>
      </Section>

      <Section title={t('basis.title')}>
        <p className="m-0">{t('basis.body')}</p>
      </Section>

      <Section title={t('health.title')}>
        <p className="m-0">{t('health.body')}</p>
      </Section>

      <Section title={t('share.title')}>
        <p className="m-0">{t('share.lead')}</p>
        <Bullets items={getList(locale, 'privacy', 'share.list')} />
        <p className="m-0">{t('share.note')}</p>
      </Section>

      <Section title={t('storage.title')}>
        <p className="m-0">{t('storage.body')}</p>
      </Section>

      <Section title={t('cookies.title')}>
        <p className="m-0">{t('cookies.body')}</p>
      </Section>

      <Section title={t('rights.title')}>
        <p className="m-0">{t('rights.lead')}</p>
        <Bullets items={getList(locale, 'privacy', 'rights.list')} />
        <p className="m-0">{t('rights.how', { phone })}</p>
      </Section>

      <Section title={t('revoke.title')}>
        <p className="m-0">{t('revoke.body')}</p>
      </Section>

      <Section title={t('changes.title')}>
        <p className="m-0">{t('changes.body')}</p>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em] sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-lg leading-relaxed text-muted">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex flex-col gap-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
