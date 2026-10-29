import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { desiredImprovementToNumber } from "@/lib/submissions";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
];

function groupBy(items, getKey) {
  const counts = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    if (key === null || key === undefined || key === "") return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts, ([name, value]) => ({ name: String(name), value }));
}

const LABEL_PADDING = 3;
const LABEL_FONT_SIZE = 14;

function PieLabel({ x, y, cx, name, value }) {
  const text = `${name} (${value})`;
  // approximate text width; SVG text can't be measured before render
  const width = text.length * LABEL_FONT_SIZE * 0.6 + LABEL_PADDING * 2;
  const height = LABEL_FONT_SIZE + LABEL_PADDING * 2;
  const rectX = x > cx ? x : x - width;
  return (
    <g>
      <rect
        x={rectX}
        y={y - height / 2}
        width={width}
        height={height}
        fill="#fff"
      />
      <text
        x={rectX + width / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000"
        fontSize={LABEL_FONT_SIZE}
      >
        {text}
      </text>
    </g>
  );
}

function StatsPie({ title, data }) {
  return (
    <div className="break-inside-avoid">
      <h3 className="mb-2 text-center font-bold">{title}</h3>
      <div style={{ direction: "ltr" }}>
        <div
          className="print-chart"
          style={{
            width: "70vw",
            height: "40vw",
            minHeight: 300,
            position: "relative",
            left: "calc(50% - 35vw)",
          }}
        >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="65%"
              label={PieLabel}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function Graphs({ data }) {
  const printRef = React.useRef<HTMLDivElement>(null);

  const answerStats = React.useMemo(
    () => groupBy(data, (s) => (parseFloat(s.answer) ? s.answer : null)).sort(
      (a, b) => Number(a.name) - Number(b.name)
    ),
    [data]
  );
  const improvementStats = React.useMemo(
    () =>
      groupBy(data, (s) => s.desired_improvement).sort(
        (a, b) =>
          (desiredImprovementToNumber(a.name) ?? 0) -
          (desiredImprovementToNumber(b.name) ?? 0)
      ),
    [data]
  );
  const barData = React.useMemo(
    () =>
      data.map((s, i) => ({
        name: [s.topic, s.slide].filter(Boolean).join(" - ") || String(i + 1),
        answer: parseFloat(s.answer) || 0,
        desired_improvement: desiredImprovementToNumber(s.desired_improvement) ?? 0,
      })),
    [data]
  );

  const handlePrint = () => {
    const node = printRef.current;
    if (!node) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((el) => el.outerHTML)
      .join("");
    // Freeze chart containers to their on-screen pixel size so the print
    // window's different viewport can't distort the layout (vw units etc.).
    const originals = node.querySelectorAll(".print-chart");
    const clone = node.cloneNode(true) as HTMLElement;
    let maxWidth = 0;
    clone.querySelectorAll<HTMLElement>(".print-chart").forEach((el, i) => {
      const { offsetWidth, offsetHeight } = originals[i] as HTMLElement;
      maxWidth = Math.max(maxWidth, offsetWidth);
      el.style.cssText = `width:${offsetWidth}px;height:${offsetHeight}px;margin:0 auto;`;
    });
    // scale down to fit an A4 page (~700px of printable width)
    const zoom = maxWidth ? Math.min(1, 700 / maxWidth) : 1;
    const printStyles = `<style>body{margin:0;padding:16px}.print-root{zoom:${zoom}}.print-root>*{margin-left:auto;margin-right:auto}</style>`;
    win.document.write(
      `<html dir="rtl"><head><title>${document.title}</title>${styles}${printStyles}</head><body><div class="print-root">${clone.innerHTML}</div></body></html>`
    );
    win.document.close();
    win.focus();
    // let stylesheets load before printing
    win.onload = () => {
      win.print();
      win.close();
    };
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={handlePrint}>
          {"הדפסה"}
        </Button>
      </div>
      <div ref={printRef} className="mt-4 space-y-8">
        <StatsPie title={"ביצוע"} data={answerStats} />
        <StatsPie title={"רצון לשינוי"} data={improvementStats} />
        <div className="break-inside-avoid">
          <h3 className="mb-2 text-center font-bold">{"ביצוע מול רצון לשינוי"}</h3>
          <div className="print-chart" style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={barData.length > 12} />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  interval={0}
                  allowDecimals={false}
                  width={40}
                  tick={{ fontWeight: "bold", dx: -5 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="answer"
                  name={"ביצוע"}
                  fill={COLORS[0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="desired_improvement"
                  name={"רצון לשינוי"}
                  fill={COLORS[1]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
