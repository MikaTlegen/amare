import Link from 'next/link'
import { ParallaxBand } from '@amare/ui'
import { ROUTES } from '@/lib/clinic'

interface Props {
  title: string
  note?: string
  image: string
  alt: string
  /** Текущая страница в хлебных крошках. */
  crumb: string
  objectPosition?: string
}

/** Обложка внутренней страницы: фото, крошки, заголовок. */
export function PageCover({ title, note, image, alt, crumb, objectPosition }: Props) {
  return (
    <ParallaxBand image={image} alt={alt} scrim="side" strength={16} objectPosition={objectPosition}>
      <div className="container-content flex flex-col justify-center gap-4 py-14 lg:py-20">
        <nav aria-label="Хлебные крошки" className="flex items-center gap-2 text-base text-white/60">
          <Link href={ROUTES.home} className="text-white/60 no-underline hover:text-white">
            Главная
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white">{crumb}</span>
        </nav>

        <h1 className="max-w-[16em] font-display text-4xl font-semibold leading-[1.1] tracking-[-0.045em] text-white sm:text-5xl sm:leading-none">
          {title}
        </h1>

        {note && <p className="max-w-[34em] text-lg leading-relaxed text-white/75">{note}</p>}
      </div>
    </ParallaxBand>
  )
}
