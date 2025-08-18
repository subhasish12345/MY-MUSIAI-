import { ImageToArtForm } from './image-to-art-form';

export default function ImageToArtPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Image-to-Art Transformer</h1>
        <p className="text-muted-foreground mt-2">
          Upload your photo and transform it into a masterpiece with a new artistic style.
        </p>
      </div>
      <ImageToArtForm />
    </div>
  );
}
