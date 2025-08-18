
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground mt-2 text-lg">Connect, share, and collaborate with fellow creators.</p>
      </div>

      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="showcase">Showcase</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="showcase">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                </CardContent>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <CardTitle>Creator {i + 1}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="forums">
           <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Forums</CardTitle>
                    <CardDescription>No active discussions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Check back later for community discussions.</p>
                </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="challenges">
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Weekly Challenge</CardTitle>
                    <CardDescription>Theme: "Retro-Futurism"</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>Create a piece of art that combines vintage aesthetics with futuristic technology.</p>
                    <Button>Submit Your Entry</Button>
                </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
