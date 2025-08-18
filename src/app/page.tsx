import { generate3DBackground } from "@/ai/flows/interactive-landing-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Image as ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { backgroundDataUri } = await generate3DBackground({ theme: "ethereal lavender and rose gold abstract particles" });

  const features = [
    {
      title: "Text-to-Art Generator",
      description: "Bring your imagination to life. Describe anything you can think of and watch our AI paint it in seconds.",
      href: "/create/text-to-art",
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      image: "https://placehold.co/600x400.png",
      aiHint: "abstract art",
    },
    {
      title: "Image-to-Art Transformer",
      description: "Upload your photos and transform them into masterpieces using dozens of artistic styles.",
      href: "/create/image-to-art",
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      image: "https://placehold.co/600x400.png",
      aiHint: "impressionist portrait",
    },
    {
      title: "AI Art Editor",
      description: "Fine-tune your creations. Use AI-powered tools to edit, enhance, and perfect your digital art.",
      href: "/create/ai-art-editor",
      icon: <Bot className="h-8 w-8 text-primary" />,
      image: "https://placehold.co/600x400.png",
      aiHint: "digital landscape",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={backgroundDataUri}
          alt="AI Generated Background"
          layout="fill"
          objectFit="cover"
          className="z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="z-20 p-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-shadow-lg animate-fade-in-down">
            The Future of Digital Art is Here
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in-up">
            MuseAI is your gateway to the new creative economy. Generate, refine, and share breathtaking art with the world's most advanced AI tools.
          </p>
          <Button asChild size="lg" className="animate-fade-in-up animation-delay-300">
            <Link href="/create/text-to-art">Start Creating Now <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Unleash Your Creativity</h2>
          <p className="text-muted-foreground mt-2 text-lg">Explore our suite of AI-powered art tools.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                 <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                   <Image src={feature.image} alt={feature.title} fill objectFit="cover" data-ai-hint={feature.aiHint} />
                 </div>
                <CardDescription className="mb-4 flex-grow">{feature.description}</CardDescription>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href={feature.href}>
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
