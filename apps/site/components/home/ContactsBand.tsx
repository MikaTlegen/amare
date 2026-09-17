import { ParallaxBand } from '@amare/ui'
import { Button } from '@amare/ui'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Контактная полоса на фото фасада.
 *
 * Фасад здесь не для красоты: человек, который приедет впервые,
 * должен узнать вход с улицы. Поэтому кадр общий, с вывеской.
 */
export function ContactsBand() {
  return (
    <ParallaxBand
      id="contacts"
      image="/photos/facade.jpg"
      alt="Вход в клинику Amare на проспекте Мәңгілік Ел"
      scrim="side"
      strength={16}
      objectPosition="center 62%"
    >
      <div className="container-content flex flex-col gap-4 py-16 lg:py-20">
        <h2 className="max-w-[16em] font-display text-3xl font-medium leading-[1.16] tracking-[-0.045em] text-white sm:text-4xl sm:leading-10">
          {CLINIC.address.full}
        </h2>
        <p className="text-lg text-white/75">{CLINIC.hours}</p>

        <a
          href={CLINIC.phones[0].href}
          className="font-display text-2xl font-semibold tracking-[-0.04em] text-white no-underline sm:text-3xl"
        >
          {CLINIC.phones[0].label}
        </a>

        <div className="mt-2 flex flex-wrap gap-3">
          <Button to={ROUTES.booking} variant="white">
            Записаться на консультацию
          </Button>
          <Button to={ROUTES.course} variant="onDark">
            Приезжаю из другого города
          </Button>
        </div>
      </div>
    </ParallaxBand>
  )
}
