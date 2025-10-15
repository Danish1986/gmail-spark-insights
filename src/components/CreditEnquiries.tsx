import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Enquiry {
  date: string;
  lender: string;
  type: "Hard" | "Soft";
  amount: number;
}

interface CreditEnquiriesProps {
  last30Days: number;
  last60Days: number;
  last90Days: number;
  enquiries: Enquiry[];
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CreditEnquiries = ({ last30Days, last60Days, last90Days, enquiries }: CreditEnquiriesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Credit Enquiries</h2>
      </div>

      {/* Time Period Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Last 30 Days</div>
          <div className="text-2xl font-bold text-foreground">{last30Days}</div>
          <Badge variant="secondary" className="mt-1 text-xs">
            Recent
          </Badge>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Last 60 Days</div>
          <div className="text-2xl font-bold text-foreground">{last60Days}</div>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Last 90 Days</div>
          <div className="text-2xl font-bold text-foreground">{last90Days}</div>
        </div>
      </div>

      {/* Impact Warning */}
      {last30Days > 2 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
          <div className="text-xs font-semibold text-orange-600">⚠️ High Enquiry Activity</div>
          <div className="text-xs text-muted-foreground mt-1">
            Multiple hard enquiries in a short period may negatively impact your credit score
          </div>
        </div>
      )}

      {/* Expand Button */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            View All Enquiries
          </>
        )}
      </Button>

      {/* Detailed List */}
      {isExpanded && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {enquiries.map((enquiry, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-3 border border-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-foreground text-sm">{enquiry.lender}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(enquiry.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <Badge
                  variant={enquiry.type === "Hard" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {enquiry.type}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Loan Amount</span>
                <span className="text-sm font-semibold text-foreground">{formatINR(enquiry.amount)}</span>
              </div>
              {enquiry.type === "Hard" && (
                <div className="text-xs text-red-500 mt-1">Impact: -3 to -5 points</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
        <div className="text-xs font-semibold text-blue-600">ℹ️ What are enquiries?</div>
        <div className="text-xs text-muted-foreground mt-1">
          <strong>Hard enquiries</strong> occur when you apply for credit and can impact your score.{" "}
          <strong>Soft enquiries</strong> are informational checks that don't affect your score.
        </div>
      </div>
    </div>
  );
};
