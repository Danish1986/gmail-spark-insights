import { FileBarChart, Download, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FinancialHealthReportProps {
  purchased: boolean;
  reportUrl?: string;
  onPurchase: () => void;
  onDownload: () => void;
}

export const FinancialHealthReport = ({
  purchased,
  reportUrl,
  onPurchase,
  onDownload,
}: FinancialHealthReportProps) => {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl p-6 shadow-lg border-2 border-purple-500/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-6 w-6 text-purple-500" />
          <h2 className="text-lg font-bold text-foreground">Financial Health Report</h2>
        </div>
        {purchased && (
          <Badge className="bg-green-500 text-white gap-1">
            <CheckCircle className="h-3 w-3" />
            Purchased
          </Badge>
        )}
      </div>

      {/* Report Preview */}
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-4">
        <div className="text-sm font-semibold text-foreground mb-3">
          Get Your Personalized Financial Health Report
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Detailed credit analysis with score breakdown</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Debt consolidation vs restructuring recommendations</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Personalized recovery path with key outcomes</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Corpus creation blueprint with investment strategy</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">12-month action plan with next steps</span>
          </div>
        </div>

        {/* Report Preview Images Placeholder */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg h-20 flex items-center justify-center">
            <FileBarChart className="h-8 w-8 text-purple-500/50" />
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg h-20 flex items-center justify-center">
            <FileBarChart className="h-8 w-8 text-pink-500/50" />
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg h-20 flex items-center justify-center">
            <FileBarChart className="h-8 w-8 text-rose-500/50" />
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 justify-center">
          <span className="text-2xl font-bold text-foreground">₹99</span>
          <span className="text-sm text-muted-foreground line-through">₹499</span>
          <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-600 border-green-500/20">
            80% OFF
          </Badge>
        </div>
      </div>

      {/* Sample Report Sections */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <div className="text-xs font-semibold text-blue-600 mb-2">📊 Report Includes:</div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>• Executive Summary</div>
          <div>• Customer Details</div>
          <div>• Liability Distribution</div>
          <div>• Recovery Path</div>
          <div>• Investment Blueprint</div>
          <div>• Action Items</div>
        </div>
      </div>

      {/* CTA Button */}
      {!purchased ? (
        <Button
          onClick={onPurchase}
          className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Sparkles className="h-4 w-4" />
          Generate Report - ₹99
        </Button>
      ) : (
        <Button
          onClick={onDownload}
          variant="outline"
          className="w-full gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10"
        >
          <Download className="h-4 w-4" />
          Download Report (PDF)
        </Button>
      )}

      {/* Trust Badge */}
      <div className="text-center mt-3">
        <div className="text-xs text-muted-foreground">
          🔒 Secure payment • Instant delivery • Money-back guarantee
        </div>
      </div>
    </div>
  );
};
