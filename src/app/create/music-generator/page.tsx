
import { MusicGeneratorForm } from './music-generator-form';

export default function MusicGeneratorPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">AI Music Generator</h1>
        <p className="text-muted-foreground mt-2">
          Describe a scene, mood, or genre, and let AI compose a unique soundtrack for you.
        </p>
      </div>
      <MusicGeneratorForm />
    </div>
  );
}
