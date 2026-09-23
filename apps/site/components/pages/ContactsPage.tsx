import { Camera, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { getT, type Locale } from '@amare/i18n'
import { Button } from '@/components/Links'
import { PageCover } from '@/components/PageCover'
import { ClinicMap } from '@/components/ClinicMap'
import { BOOKING_URL, CLINIC } from '@/lib/clinic'

/** Контакты (S-02 ТЗ): адрес, телефоны, график, каналы связи и карта. */
export function ContactsPage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'contacts')
  const common = getT(locale, 'common')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/facade.jpg"
        alt={t('cover.alt')}
        objectPosition="center 60%"
      />

      <section className="container-content grid gap-8 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Phone className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
              {t('phones.title')}
            </h2>
            {CLINIC.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className={
                  phone.primary
                    ? 'tap-target text-2xl font-semibold no-underline'
                    : 'tap-target text-lg text-muted no-underline'
                }
              >
                {phone.label}
              </a>
            ))}
            <p className="m-0 text-base leading-relaxed text-muted">{t('phones.note')}</p>
          </article>

          <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Clock className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
              {t('hours.title')}
            </h2>
            <p className="m-0 text-lg leading-relaxed">{t('hours')}</p>
            <p className="m-0 text-base leading-relaxed text-muted">{t('hours.note')}</p>
          </article>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7">
          <article className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <MapPin className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
              {t('address.title')}
            </h2>
            <p className="m-0 text-lg leading-relaxed">{t('addressFull')}</p>
            <p className="m-0 text-base leading-relaxed text-muted">{t('address.note')}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button href={CLINIC.whatsapp} variant="outline">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {common('contact.whatsapp')}
              </Button>
              <Button href={CLINIC.instagram} variant="outline">
                <Camera className="h-5 w-5" aria-hidden="true" />
                {common('contact.instagram')}
              </Button>
              <Button href={BOOKING_URL}>{t('address.book')}</Button>
            </div>
          </article>
        </div>
      </section>

      {/*
       * Карта во всю ширину контента: внутри колонки lg:col-span-7 карточке
       * адреса доставалось ~19% ширины страницы и номер телефона переносился
       * на две строки.
       */}
      <section className="container-content pb-16 pt-8 lg:pb-20 lg:pt-10">
        <ClinicMap />
      </section>
    </>
  )
}
