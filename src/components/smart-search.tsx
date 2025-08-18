'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { handleSmartSearch } from '@/app/actions';
import type { SmartSearchAutosuggestOutput } from '@/ai/flows/smart-search-autosuggest';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { LineChart, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SmartSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmartSearch({ open, onOpenChange }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SmartSearchAutosuggestOutput['suggestions']>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      startTransition(async () => {
        const res = await handleSmartSearch({ query: debouncedQuery });
        if (res && !res.error) {
          setResults(res.suggestions);
        } else {
          setResults([]);
        }
      });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Smart Search</DialogTitle>
          <Input
            placeholder="Search by artist, style, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-4"
          />
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-6">
            {isPending && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}><CardHeader><Skeleton className="h-24 w-full" /></CardHeader><CardContent><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardContent></Card>
                ))}
              </div>
            )}
            {!isPending && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-32 w-full">
                        <Image
                          src={item.previewImageUrl || 'https://placehold.co/400x200.png'}
                          alt={item.value}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint="abstract art"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="capitalize mb-2">{item.type}</Badge>
                      <h3 className="font-semibold">{item.value}</h3>
                    </CardContent>
                    {item.trustStats && (
                      <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
                         <div className="flex items-center gap-2">
                           <LineChart className="h-4 w-4" />
                           <span>{item.trustStats.numberOfWorks ?? 'N/A'} works</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                           <span>{item.trustStats.numberOfArtists ?? 'N/A'} artists</span>
                         </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
             {!isPending && query.length > 1 && results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No suggestions found for &quot;{query}&quot;.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
