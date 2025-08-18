
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground mt-2 text-lg">Buy and sell unique AI-generated assets.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
               <div className="aspect-square bg-muted rounded-t-lg"></div>
            </CardContent>
            <CardHeader>
              <CardTitle>Asset {i + 1}</CardTitle>
              <CardDescription>Price: 0.1 ETH</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Buy Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
