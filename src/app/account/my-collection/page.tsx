import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyCollectionPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">My Collection</h1>
        <p className="text-muted-foreground mt-2">
          All your generated and collected masterpieces in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
            </CardContent>
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
            </CardHeader>
             <CardContent>
              <Button variant="secondary" className="w-full" disabled>View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
