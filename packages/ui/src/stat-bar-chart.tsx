"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Столбчатый график по готовым подписанным значениям — для сводок вида
 * «сколько чего сейчас», без денег и без операций над данными.
 * Стилистически повторяет BarthelChart: цвета из токенов палитры,
 * подписи растут вместе с --font-scale.
 */
export function StatBarChart({
  data,
  height = "14rem",
}: {
  data: { label: string; value: number }[];
  height?: string;
}) {
  const axisColor = "rgb(var(--c-muted))";
  const gridColor = "rgb(var(--c-line))";

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -8 }}>
          <CartesianGrid vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisColor, fontSize: "0.8rem" }}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: axisColor, fontSize: "0.8rem" }} />
          <Tooltip
            cursor={{ fill: "rgb(var(--c-sky) / 0.14)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgb(var(--c-line))",
              background: "rgb(var(--c-surface))",
              color: "rgb(var(--c-ink))",
              fontSize: "0.85rem",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
            {data.map((point, i) => (
              <Cell key={point.label} fill={`rgb(var(--c-brand) / ${0.45 + i * 0.13})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
