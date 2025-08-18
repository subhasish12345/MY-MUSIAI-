
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <div className="aspect-square bg-muted rounded-t-lg"></div>
            </CardContent>
            <CardHeader>
              <CardTitle>Artwork {i + 1}</CardTitle>
            </CardHeader>
          </Card>>
        ))}
      </div>
    </div>
  );
}
