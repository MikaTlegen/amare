import { Hero } from '@/components/home/Hero'
import { FactsStrip } from '@/components/home/FactsStrip'
import { TwoDoors } from '@/components/home/TwoDoors'
import { DirectionsBand } from '@/components/home/DirectionsBand'
import { CourseStepsRow } from '@/components/home/CourseStepsRow'
import { Quiz } from '@/components/home/Quiz'
import { ResultsBand } from '@/components/home/ResultsBand'
import { DoctorsRow } from '@/components/home/DoctorsRow'
import { ContactsBand } from '@/components/home/ContactsBand'
import { Reviews } from '@/components/home/Reviews'
import { ClinicMap } from '@/components/ClinicMap'

/**
 * Главная.
 *
 * Держим её короткой: каждый блок — заголовок, одна строка и ссылка внутрь.
 * Длинные тексты живут на страницах «Направления», «Курс и цены», «Врачи».
 * Светлые секции чередуются с фото-полосами, чтобы страница дышала.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <FactsStrip />
      <TwoDoors />
      <DirectionsBand />
      <CourseStepsRow />
      <Quiz />
      <ResultsBand />
      <DoctorsRow />
      <Reviews />
      <ContactsBand />

      <section className="container-content py-12">
        <ClinicMap />
      </section>
    </>
  )
}
