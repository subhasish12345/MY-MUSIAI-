'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleGenerateMusic } from '@/app/actions';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a prompt of at least 10 characters.' }),
  duration: z.number().min(5).max(30),
  mood: z.string().optional(),
});

export function MusicGeneratorForm() {
  const [isPending, startTransition] = useTransition();
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      duration: 10,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setGeneratedMusic(null);
    startTransition(async () => {
      const result = await handleGenerateMusic(values);
      if (result?.error) {
        toast({
          title: 'Generation Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.audioDataUri) {
        setGeneratedMusic(result.audioDataUri);
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
                        placeholder="e.g., An epic cinematic score for a space battle, with orchestral strings and powerful drums."
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
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a mood" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="happy">Happy</SelectItem>
                            <SelectItem value="sad">Sad</SelectItem>
                            <SelectItem value="energetic">Energetic</SelectItem>
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="epic">Epic</SelectItem>
                          </SelectContent>
                        </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="duration"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds): {value}s</FormLabel>
                    <FormControl>
                       <Slider
                        defaultValue={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                        min={5}
                        max={30}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Generating...' : 'Generate Music'}
                {!isPending && <Music className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-full">
        <Card className="h-full">
          <CardContent className="p-6 h-full flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden p-4">
              {isPending && <Skeleton className="h-24 w-full" />}
              {!isPending && generatedMusic && (
                <audio controls src={generatedMusic} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              )}
              {!isPending && !generatedMusic && (
                <div className="text-center text-muted-foreground">
                  <p>Your generated music will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
