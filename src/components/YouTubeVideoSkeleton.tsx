import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const YouTubeVideoSkeleton = () => {
    return (
        <Card className="bg-card border-gold/10 overflow-hidden">
            <div className="relative">
                <AspectRatio ratio={16 / 9}>
                    <Skeleton className="w-full h-full" />
                </AspectRatio>
            </div>

            <CardContent className="p-4 space-y-2">
                <div className="space-y-2">
                    {/* Title skeleton - 2 lines */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Views count skeleton */}
                <div className="flex items-center gap-4 pt-2">
                    <Skeleton className="h-3 w-16" />
                </div>
            </CardContent>
        </Card>
    );
};
