import { FACTS } from '@/data/course'

/**
 * Полоса фактов под первым экраном.
 *
 * Здесь только проверяемые вещи: рейтинг 2ГИС, размер команды, цена курса,
 * источники финансирования. Никаких «тысяч довольных пациентов» —
 * непроверяемая цифра в медицине работает против доверия.
 */
export function FactsStrip() {
  return (
    <section
      aria-label="Коротко о клинике"
      className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
    >
      {FACTS.map((fact) => (
        <div key={fact.value} className="flex flex-col gap-0.5 bg-bg px-6 py-6 lg:px-8">
          <span className="font-display text-2xl font-semibold tracking-[-0.04em]">
            {fact.value}
          </span>
          <span className="text-base text-muted">{fact.note}</span>
        </div>
      ))}
    </section>
  )
}
