import { AiArtEditorForm } from "./ai-art-editor-form";

export default function AiArtEditorPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">AI Art Editor</h1>
        <p className="text-muted-foreground mt-2">
          Use natural language to edit your art. Perform inpainting, outpainting, palette adjustments and more.
        </p>
      </div>
      <AiArtEditorForm />
    </div>
  );
}
