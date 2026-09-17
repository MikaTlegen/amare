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
import { DEMO_PROGRESS, type ProgressPoint } from '@/data/progress'

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
  data = DEMO_PROGRESS,
  height = '15rem',
}: {
  onDark?: boolean
  /** Ряд замеров. По умолчанию — демонстрационный. */
  data?: ProgressPoint[]
  height?: string
}) {
  const axisColor = onDark ? 'rgb(154 184 196)' : 'rgb(90 95 92)'
  const gridColor = onDark ? 'rgb(255 255 255 / 0.12)' : 'rgb(227 223 215)'

  return (
    <figure className="m-0 flex flex-col gap-3">
      <figcaption className="sr-only">
        Индекс Бартел вырос с 25 баллов в первый день курса до 80 баллов на двадцатый.
        Демонстрационные данные.
      </figcaption>

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: axisColor, fontSize: 14 }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: axisColor, fontSize: 14 }}
            />
            <Tooltip
              cursor={{ fill: 'rgb(127 215 242 / 0.14)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgb(227 223 215)',
                fontSize: 15,
              }}
              formatter={(value) => [`${value} баллов`, 'Индекс Бартел']}
            />
            <Bar dataKey="barthel" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((point, i) => (
                <Cell
                  key={point.day}
                  fill={
                    i === data.length - 1
                      ? 'rgb(200 53 46)'
                      : onDark
                        ? `rgb(127 215 242 / ${0.3 + i * 0.17})`
                        : `rgb(6 113 143 / ${0.35 + i * 0.16})`
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
