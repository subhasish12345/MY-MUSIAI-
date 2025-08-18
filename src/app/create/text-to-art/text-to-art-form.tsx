'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleGenerateArt } from '@/app/actions';
import { ART_STYLES } from '@/lib/constants';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a prompt of at least 10 characters.' }),
  style: z.string().min(1, { message: 'Please select a style.' }),
});

export function TextToArtForm() {
  const [isPending, startTransition] = useTransition();
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: ART_STYLES[0],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setGeneratedArt(null);
    startTransition(async () => {
      const result = await handleGenerateArt(values);
      if (result?.error) {
        toast({
          title: 'Generation Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.artDataUri) {
        setGeneratedArt(result.artDataUri);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A steampunk cat piloting a vintage airship over a futuristic city"
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
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Generating...' : 'Generate Art'}
                {!isPending && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-full aspect-square">
        <Card className="h-full">
          <CardContent className="p-2 h-full">
            <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
              {isPending && <Skeleton className="h-full w-full" />}
              {!isPending && generatedArt && (
                <Image src={generatedArt} alt="Generated Art" layout="fill" objectFit="contain" />
              )}
              {!isPending && !generatedArt && (
                <div className="text-center text-muted-foreground p-4">
                  <p>Your generated art will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
