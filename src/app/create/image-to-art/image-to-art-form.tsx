'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleImageToArt } from '@/app/actions';
import { ART_STYLES } from '@/lib/constants';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  photoDataUri: z.string().min(1, { message: 'Please upload an image.' }),
  style: z.string().min(1, { message: 'Please select a style.' }),
  styleMixRatio: z.number().min(0).max(1),
});

export function ImageToArtForm() {
  const [isPending, startTransition] = useTransition();
  const [transformedArt, setTransformedArt] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: '',
      style: ART_STYLES[0],
      styleMixRatio: 0.5,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setTransformedArt(null);
    startTransition(async () => {
      const result = await handleImageToArt(values);
      if (result?.error) {
        toast({
          title: 'Transformation Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.transformedPhotoDataUri) {
        setTransformedArt(result.transformedPhotoDataUri);
      }
    });
  };

  const originalImage = form.watch('photoDataUri');

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="photoDataUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Image</FormLabel>
                      <FormControl>
                        <FileUpload id="image-upload" onFileChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artistic Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ART_STYLES.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="styleMixRatio"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Style Mix Ratio: {Math.round(value * 100)}%</FormLabel>
                        <FormControl>
                           <Slider
                            defaultValue={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                            max={1}
                            step={0.01}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending || !originalImage} className="w-full">
                {isPending ? 'Transforming...' : 'Transform Image'}
                {!isPending && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(originalImage || transformedArt) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-center font-semibold">Original</h3>
            <Card className="aspect-square">
              <CardContent className="p-2 h-full">
                <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
                  {originalImage ? <Image src={originalImage} alt="Original" layout="fill" objectFit="contain" /> : <p className="text-muted-foreground">Upload an image</p>}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-2">
            <h3 className="text-center font-semibold">Transformed</h3>
            <Card className="aspect-square">
              <CardContent className="p-2 h-full">
                <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
                  {isPending && <Skeleton className="h-full w-full" />}
                  {!isPending && transformedArt && (
                    <Image src={transformedArt} alt="Transformed Art" layout="fill" objectFit="contain" />
                  )}
                  {!isPending && !transformedArt && (
                    <p className="text-muted-foreground">Your result will appear here</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
