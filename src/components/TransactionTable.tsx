import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TransactionTableProps {
  data: Array<{
    range: string;
    count: number;
    percentage: number;
    potentialRewards: number;
  }>;
}

export const TransactionTable = ({ data }: TransactionTableProps) => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-semibold">Amount Range</TableHead>
            <TableHead className="font-semibold text-right">Transactions</TableHead>
            <TableHead className="font-semibold text-right">Percentage</TableHead>
            <TableHead className="font-semibold text-right">Potential Rewards</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-accent/50 transition-colors">
              <TableCell className="font-medium">{row.range}</TableCell>
              <TableCell className="text-right">{row.count}</TableCell>
              <TableCell className="text-right text-muted-foreground">{row.percentage}%</TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-success">₹{row.potentialRewards.toLocaleString("en-IN")}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
