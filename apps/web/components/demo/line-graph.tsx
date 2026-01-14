"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

interface DataPoint {
  label: string;
  value: number;
}

export function LineGraph({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const data = (props.data as DataPoint[]) || [];
  const title = props.title as string | undefined;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  // Calculate points for the SVG path
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 50;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return { x, y, ...d };
  });

  const pathD =
    points.length > 0
      ? `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
      : "";

  return (
    <div className={`${baseClass} ${customClass}`}>
      {title ? (
        <div className="text-xs font-medium mb-2 text-left">{title}</div>
      ) : null}
      <div className="relative h-24">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="currentColor"
            strokeOpacity="0.1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="text-foreground/80"
            />
          )}
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              className="fill-foreground"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      {data.length > 0 && (
        <div className="flex justify-between mt-1">
          {data.map((d, i) => (
            <div
              key={i}
              className="text-[8px] text-muted-foreground text-center"
              style={{ width: `${100 / data.length}%` }}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
