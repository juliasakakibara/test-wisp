import { FeatureHighlightCard } from "@/components/ui/feature-highlight-card";

/**
 * A demo component to showcase the FeatureHighlightCard.
 */
export default function FeatureHighlightCardDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <FeatureHighlightCard
        imageSrc="https://images.unsplash.com/photo-1640622300473-977435c38c04?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Stopwatch and financial chart on a phone screen"
        title="Perfect Your Timing"
        description="Utilize advanced technical indicators to pinpoint ideal entry and exit points. Clearly identify overbought and oversold conditions in real-time, ensuring optimal timing and better risk management for your trades."
        buttonText="Try Now for Free"
      />
    </div>
  );
}
