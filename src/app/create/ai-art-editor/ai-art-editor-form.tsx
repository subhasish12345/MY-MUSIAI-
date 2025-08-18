'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleAiArtEdit } from '@/app/actions';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  imageUri: z.string().min(1, { message: 'Please upload an image to edit.' }),
  editInstructions: z.string().min(10, { message: 'Please provide detailed edit instructions.' }),
  paletteAdjustment: z.string().optional(),
  enhancementLevel: z.enum(['low', 'medium', 'high']).optional(),
});

type AIArtEditorResult = {
  editedImageUri: string;
  editSummary: string;
};

export function AiArtEditorForm() {
  const [isPending, startTransition] = useTransition();
  const [editResult, setEditResult] = useState<AIArtEditorResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUri: '',
      editInstructions: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setEditResult(null);
    startTransition(async () => {
      const result = await handleAiArtEdit(values);
      if (result?.error) {
        toast({
          title: 'Editing Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.editedImageUri) {
        setEditResult({
          editedImageUri: result.editedImageUri,
          editSummary: result.editSummary,
        });
      }
    });
  };

  const originalImage = form.watch('imageUri');

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="imageUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image to Edit</FormLabel>
                      <FormControl>
                        <FileUpload id="art-edit-upload" onFileChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="editInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edit Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Remove the person on the left and make the sky look like a sunset.'"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paletteAdjustment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palette Adjustment (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="No adjustment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warmer">Warmer</SelectItem>
                            <SelectItem value="cooler">Cooler</SelectItem>
                            <SelectItem value="vibrant">More Vibrant</SelectItem>
                            <SelectItem value="muted">More Muted</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enhancementLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enhancement Level (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="No enhancement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending || !originalImage} className="w-full">
                {isPending ? 'Editing...' : 'Edit with AI'}
                {!isPending && <Wand2 className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(originalImage || editResult) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-center font-semibold">Original</h3>
            <Card className="aspect-square">
              <CardContent className="p-2 h-full">
                <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
                  {originalImage && <Image src={originalImage} alt="Original" layout="fill" objectFit="contain" />}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-2">
            <h3 className="text-center font-semibold">Edited</h3>
            <Card className="aspect-square">
              <CardContent className="p-2 h-full">
                <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
                  {isPending && <Skeleton className="h-full w-full" />}
                  {!isPending && editResult && <Image src={editResult.editedImageUri} alt="Edited Art" layout="fill" objectFit="contain" />}
                  {!isPending && !editResult && <p className="text-muted-foreground p-4 text-center">Your edited art will appear here.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!isPending && editResult && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{editResult.editSummary}</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
