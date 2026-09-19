import { Footprints, Hand, MessageSquare, Brain, BedDouble, type LucideIcon } from 'lucide-react'

export interface Direction {
  /** Ключи текста в словаре directions — `<id>.title`, `<id>.full` и т. д. */
  id: string
  icon: LucideIcon
  photo?: string
}

/**
 * Источник: описание услуг клиники и раздел 3 ТЗ.
 *
 * Текст переехал в @amare/i18n (namespace directions): здесь остались
 * только порядок, иконки и фотографии. Полноту ключей для каждого id
 * сторожит apps/site/data/content.test.ts.
 */
export const DIRECTIONS: Direction[] = [
  { id: 'walking', icon: Footprints, photo: '/photos/walk-bars.jpg' },
  { id: 'hand', icon: Hand, photo: '/photos/hand-therapy.jpg' },
  { id: 'speech', icon: MessageSquare, photo: '/photos/speech-therapy.webp' },
  { id: 'cognitive', icon: Brain, photo: '/photos/library.jpg' },
  { id: 'bedridden', icon: BedDouble, photo: '/photos/hospital-ward.jpg' },
]

/*
 * Профили пациентов переехали в data/doctors.ts (CONDITION_LIST):
 * там же лежит связь «состояние → специалисты», и держать список
 * в двух местах — верный способ развести их по содержанию.
 */
