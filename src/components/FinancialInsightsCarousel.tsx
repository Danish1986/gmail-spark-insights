import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { financialInsights } from "@/data/financialInsights";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FinancialInsightsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % financialInsights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? financialInsights.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % financialInsights.length);
  };

  const insight = financialInsights[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="relative overflow-hidden border-2">
        <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient} opacity-10`} />
        
        <div className="relative p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{insight.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-foreground">{insight.title}</h3>
              <p className="text-muted-foreground mb-4">{insight.description}</p>
              <div className={`text-4xl font-bold bg-gradient-to-r ${insight.gradient} bg-clip-text text-transparent`}>
                {insight.stat}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Previous insight"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {financialInsights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                  aria-label={`Go to insight ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Next insight"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
