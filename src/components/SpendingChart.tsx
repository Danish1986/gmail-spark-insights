import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SpendingChartProps {
  data: Array<{ day: string; amount: number }>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground">{payload[0].payload.day}</p>
        <p className="text-sm text-success">₹{payload[0].value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export const SpendingChart = ({ data }: SpendingChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.amount));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
        />
        <YAxis
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => {
            const intensity = entry.amount / maxValue;
            const color = `hsl(262 ${83 * intensity}% ${58 + (1 - intensity) * 20}%)`;
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
