import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { financialInsights } from "@/data/financialInsights";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FinancialInsightsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % financialInsights.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setDirection("left");
    setCurrentIndex((prev) => 
      prev === 0 ? financialInsights.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % financialInsights.length);
  };

  const insight = financialInsights[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-xs text-muted-foreground italic px-4">
          Insights from Growi users across India
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative">
        <Card className="relative overflow-hidden border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient} opacity-10 transition-opacity duration-700`} />
          
          {/* Content with fade animation */}
          <div 
            key={currentIndex}
            className="relative p-8 animate-fade-in"
          >
            <div className="flex items-start gap-6">
              {/* Animated icon */}
              <div className="text-6xl transform hover:scale-110 transition-transform duration-300">
                {insight.icon}
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-foreground leading-tight">
                  {insight.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                {/* Animated stat with gradient */}
                <div className={`text-5xl font-bold bg-gradient-to-r ${insight.gradient} bg-clip-text text-transparent animate-scale-in`}>
                  {insight.stat}
                </div>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <button
                onClick={goToPrevious}
                className="p-2.5 rounded-full hover:bg-accent/80 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Previous insight"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Progress dots */}
              <div className="flex gap-2.5">
                {financialInsights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? "right" : "left");
                      setCurrentIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? "w-10 bg-primary shadow-lg" 
                        : "w-2.5 bg-muted hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to insight ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2.5 rounded-full hover:bg-accent/80 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Next insight"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Insight counter */}
            <div className="text-center mt-4">
              <span className="text-xs text-muted-foreground font-medium">
                {currentIndex + 1} of {financialInsights.length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
