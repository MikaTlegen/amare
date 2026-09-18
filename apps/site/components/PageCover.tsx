/* eslint-disable @next/next/no-img-element -- обложка грузит одно фото; next/image — отдельная задача */
import Link from 'next/link'
import { ROUTES } from '@/lib/clinic'

interface Props {
  title: string
  note?: string
  image: string
  alt: string
  /** Текущая страница в хлебных крошках. */
  crumb: string
  /** Фокус кадра для размытой подложки: 'center 60%' и т.п. */
  objectPosition?: string
}

/**
 * Обложка внутренней страницы: фото, крошки, заголовок.
 *
 * Фото показывается ЦЕЛИКОМ (object-contain), а не кадрируется: на
 * снимках клиники важны оборудование и обстановка, и срезанный кадр
 * выглядел как ошибка вёрстки.
 *
 * Пустоту по краям закрывает та же фотография, растянутая и размытая, —
 * приём из видеоплееров. Поэтому у обложки нет ни чёрных полос, ни
 * обрезки, и текст остаётся читаемым: поверх лежит тёмная вуаль
 * (белый текст на ней даёт больше 4.5:1 даже на светлом кадре).
 */
export function PageCover({ title, note, image, alt, crumb, objectPosition = 'center' }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Подложка: то же фото во всю ширину, размытое — заполняет поля по краям */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-2xl"
        style={{ objectPosition }}
      />

      <div className="mx-auto grid max-w-content items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-20 lg:py-16">
        <div className="flex flex-col justify-center gap-4 lg:col-span-6">
          <nav
            aria-label="Хлебные крошки"
            className="flex items-center gap-2 text-base text-white/70"
          >
            <Link href={ROUTES.home} className="text-white/70 no-underline hover:text-white">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{crumb}</span>
          </nav>

          <h1 className="max-w-[16em] font-display text-4xl font-semibold leading-[1.1] tracking-[-0.045em] text-white sm:text-5xl sm:leading-none">
            {title}
          </h1>

          {note && <p className="max-w-[34em] text-lg leading-relaxed text-white/80">{note}</p>}
        </div>

        {/* Фото целиком: высота ограничена, ширина подстраивается */}
        <div className="lg:col-span-6">
          <img
            src={image}
            alt={alt}
            className="mx-auto max-h-96 w-full rounded-3xl object-contain shadow-2xl"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[rgba(6,32,42,0.78)] lg:bg-linear-to-r lg:from-[rgba(6,32,42,0.92)] lg:via-[rgba(6,32,42,0.8)] lg:to-[rgba(6,32,42,0.72)]"
      />
    </section>
  )
}
