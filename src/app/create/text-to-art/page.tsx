import { TextToArtForm } from "./text-to-art-form";

export default function TextToArtPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Text-to-Art Generator</h1>
        <p className="text-muted-foreground mt-2">
          Describe your vision and let our AI bring it to life. Experiment with different styles and prompts.
        </p>
      </div>
      <TextToArtForm />
    </div>
  );
}
