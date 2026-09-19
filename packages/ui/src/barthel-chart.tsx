'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import type { ScalePoint } from '@amare/api-client'

/**
 * Динамика индекса Бартел за курс.
 *
 * Почему столбики, а не линия: точек всего пять и это замеры в фиксированные
 * дни, а не непрерывный процесс. Линия подразумевала бы, что между замерами
 * известно значение, — это неправда.
 *
 * Последний столбец выделен акцентом: взгляд должен уходить к результату.
 * Ось Y зафиксирована 0–100, иначе рост выглядит драматичнее, чем он есть, —
 * в медицинских данных это недопустимо.
 */
export function BarthelChart({
  onDark = false,
  data,
  height = '15rem',
}: {
  onDark?: boolean
  data: ScalePoint[]
  height?: string
}) {
  // Цвета — через переменные палитры: иначе график не следует контрастной теме.
  // Кегли подписей в rem, а не в px: они должны расти вместе с --font-scale (S-13).
  const axisColor = onDark ? 'rgb(255 255 255 / 0.72)' : 'rgb(var(--c-muted))'
  const gridColor = onDark ? 'rgb(255 255 255 / 0.12)' : 'rgb(var(--c-line))'

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="sr-only">Динамика индекса Бартел по дням курса.</figcaption>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -8 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fill: axisColor, fontSize: '0.8rem' }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: axisColor, fontSize: '0.8rem' }}
            />
            <Tooltip
              cursor={{ fill: 'rgb(var(--c-sky) / 0.14)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgb(var(--c-line))',
                background: 'rgb(var(--c-surface))',
                color: 'rgb(var(--c-ink))',
                fontSize: '0.85rem',
              }}
              formatter={(value) => [`${value} баллов`, 'Индекс Бартел']}
            />
            <Bar dataKey="barthel" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((point, i) => (
                <Cell
                  key={point.day}
                  fill={
                    i === data.length - 1
                      ? 'rgb(var(--c-accent))'
                      : onDark
                        ? `rgb(var(--c-sky) / ${0.45 + i * 0.13})`
                        : `rgb(var(--c-brand) / ${0.45 + i * 0.13})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
