import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartSectionProps {
  title: string;
  data: ChartData[];
  type?: "bar" | "progress";
}

const formatINR = (amount: number) => {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

const shortINR = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl text-xs shadow-2xl">
        <div className="opacity-70 mb-1">{payload[0].payload.name}</div>
        <div className="font-bold">{formatINR(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

const Dot = ({ color }: { color: string }) => (
  <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: color }} />
);

export const ChartSection = ({ title, data, type = "bar" }: ChartSectionProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mx-3 mt-5">
      <div className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-foreground" /> {title}
      </div>
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        {type === "bar" ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={shortINR} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} width={60} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 divide-y">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center text-foreground font-medium">
                    <Dot color={item.color} /> {item.name}
                  </div>
                  <div className="text-foreground font-semibold">
                    {formatINR(item.value)}
                    <span className="ml-2 text-muted-foreground font-normal">
                      ({((item.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            {data.map((item, idx) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between font-medium text-foreground mb-1">
                    <span>
                      <Dot color={item.color} /> {item.name}
                    </span>
                    <span>
                      {formatINR(item.value)} • {percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${percentage}%`, background: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
