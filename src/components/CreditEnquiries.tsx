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
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-5 w-5 text-primary" />
        <h2 className="text-base font-bold text-foreground">Credit Enquiries</h2>
      </div>

      {/* Time Period Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-background rounded-xl p-3 text-center border border-border shadow-sm">
          <div className="text-xs text-muted-foreground mb-1">Last 30 Days</div>
          <div className="text-2xl font-bold text-foreground">{last30Days}</div>
          {last30Days > 0 && (
            <Badge variant="secondary" className="mt-1.5 text-xs">Recent</Badge>
          )}
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-border shadow-sm">
          <div className="text-xs text-muted-foreground mb-1">Last 60 Days</div>
          <div className="text-2xl font-bold text-foreground">{last60Days}</div>
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-border shadow-sm">
          <div className="text-xs text-muted-foreground mb-1">Last 90 Days</div>
          <div className="text-2xl font-bold text-foreground">{last90Days}</div>
        </div>
      </div>

      {/* Impact Warning */}
      {last30Days > 2 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 mb-3">
          <div className="text-xs font-semibold text-orange-600">⚠️ High Enquiry Activity</div>
          <div className="text-xs text-muted-foreground mt-1">
            Multiple hard enquiries in a short period may negatively impact your credit score
          </div>
        </div>
      )}

      {/* Expand Button */}
      <Button
        variant="outline"
        className="w-full gap-2 mb-3"
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
        <div className="space-y-2 max-h-64 overflow-y-auto">
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mt-3">
        <div className="text-xs font-semibold text-blue-700 mb-1">ℹ️ What are enquiries?</div>
        <div className="text-xs text-gray-600 leading-relaxed">
          <strong>Hard enquiries</strong> impact your score. <strong>Soft enquiries</strong> don't affect it.
        </div>
      </div>
    </div>
  );
};
