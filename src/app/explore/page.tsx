
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Explore AI Art</h1>
        <p className="text-muted-foreground mt-2 text-lg">Discover amazing creations from the community.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
            </CardContent>
            <CardHeader>
              <CardTitle>
                 <Skeleton className="h-6 w-3/4" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
