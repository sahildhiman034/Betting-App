import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const HelpSupport = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Help and Support</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Why is my bet not getting matched?</AccordionTrigger>
          <AccordionContent>
            Exchange bets match when opposing prices meet. If liquidity is low, your bet stays unmatched until a counter bet appears, or you can adjust the odds.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What does 'In-Play' mean?</AccordionTrigger>
          <AccordionContent>
            In-Play markets are live during an event with dynamic odds that update in real time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What are the color codes on the odds?</AccordionTrigger>
          <AccordionContent>
            Blue = Back prices, Pink = Lay prices. Higher liquidity typically shows deeper colors.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How do I cancel an unmatched bet?</AccordionTrigger>
          <AccordionContent>
            Open your Bet Slip or My Bets panel and click the remove/cancel button next to the unmatched selection.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 space-y-2">
        <h2 className="font-semibold">Contact Support</h2>
        <p className="text-sm text-muted-foreground">Live Chat: Available 24/7 (bottom right)</p>
        <p className="text-sm text-muted-foreground">Email: support@arenax.example</p>
      </div>
    </div>
  );
};


