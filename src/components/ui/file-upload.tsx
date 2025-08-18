'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from './button';

interface FileUploadProps {
  onFileChange: (dataUri: string) => void;
  id: string;
}

export function FileUpload({ onFileChange, id }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setPreview(dataUri);
        onFileChange(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onFileChange('');
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="w-full">
      <Label htmlFor={id} className="cursor-pointer">
        <div className="relative w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Image preview"
                layout="fill"
                objectFit="contain"
                className="p-2 rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 mb-2" />
              <span>Click to upload an image</span>
              <span className="text-xs mt-1">PNG, JPG, WEBP recommended</span>
            </>
          )}
        </div>
      </Label>
      <Input
        id={id}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
}
