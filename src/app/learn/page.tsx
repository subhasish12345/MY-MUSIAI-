
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LearnPage() {
  const faqItems = [
    {
      question: "What is MuseAI?",
      answer: "MuseAI is a platform for creating, sharing, and trading AI-generated art and assets.",
    },
    {
      question: "How do I create art?",
      answer: "You can use our Text-to-Art, Image-to-Art, or AI Art Editor tools to generate unique creations.",
    },
    {
      question: "Can I sell my creations?",
      answer: "Yes, our marketplace allows you to list your creations for sale as NFTs.",
    },
    {
        question: "What is the community tab for?",
        answer: "The community tab is a place to connect with other artists, share your work, and participate in challenges."
    }
  ];

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Learn More</h1>
        <p className="text-muted-foreground mt-2 text-lg">Frequently asked questions about MuseAI.</p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
