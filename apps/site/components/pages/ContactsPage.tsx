import { Camera, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@amare/ui'
import { PageCover } from '@/components/PageCover'
import { ClinicMap } from '@/components/ClinicMap'
import { CLINIC, ROUTES } from '@/lib/clinic'

/** Контакты (S-02 ТЗ): адрес, телефоны, график, каналы связи и карта. */
export function ContactsPage() {
  return (
    <>
      <PageCover
        crumb="Контакты"
        title="Как с нами связаться и как доехать"
        note="Быстрее всего — позвонить в рабочее время. В WhatsApp отвечаем в порядке очереди."
        image="/photos/facade.jpg"
        alt="Фасад здания, в котором находится клиника Amare"
        objectPosition="center 60%"
      />

      <section className="container-content grid gap-8 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Phone className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">Телефоны</h2>
            {CLINIC.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className={
                  phone.primary
                    ? 'text-2xl font-semibold no-underline'
                    : 'text-lg text-muted no-underline'
                }
              >
                {phone.label}
              </a>
            ))}
            <p className="m-0 text-base leading-relaxed text-muted">
              Бесплатная 15-минутная первичная консультация по телефону — чтобы понять, нужен ли
              очный приём.
            </p>
          </article>

          <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Clock className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
              Режим работы
            </h2>
            <p className="m-0 text-lg leading-relaxed">{CLINIC.hours}</p>
            <p className="m-0 text-base leading-relaxed text-muted">
              В нерабочее время заявка через анкету попадает администратору первой же утренней
              сменой.
            </p>
          </article>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7">
          <article className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <MapPin className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">Адрес</h2>
            <p className="m-0 text-lg leading-relaxed">{CLINIC.address.full}</p>
            <p className="m-0 text-base leading-relaxed text-muted">
              Если человек в коляске или ему тяжело идти — предупредите при записи, встретим.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button href={CLINIC.whatsapp} variant="outline">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp
              </Button>
              <Button href={CLINIC.instagram} variant="outline">
                <Camera className="h-5 w-5" aria-hidden="true" />
                Instagram
              </Button>
              <Button to={ROUTES.booking}>Записаться</Button>
            </div>
          </article>

          <ClinicMap />
        </div>
      </section>
    </>
  )
}
