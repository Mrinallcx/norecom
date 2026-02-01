import { useState } from "react";
import { Check, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { YouTubeChannel } from "@/services/youtubeService";
import { useSavedCreators } from "@/hooks/useSavedCreators";

interface SaveCreatorDialogProps {
  channel: YouTubeChannel | null;
  existingCategories: string[];
  onClose: () => void;
}

const SaveCreatorDialog = ({ channel, existingCategories, onClose }: SaveCreatorDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const { saveCreator } = useSavedCreators();

  if (!channel) return null;

  const handleSave = () => {
    const category = isAddingCustom && customCategory.trim() 
      ? customCategory.trim() 
      : selectedCategory;

    saveCreator.mutate(
      {
        channel_id: channel.id,
        channel_name: channel.name,
        channel_avatar: channel.avatar,
        subscriber_count: channel.subscriberCount,
        video_count: channel.videoCount,
        description: channel.description,
        category,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const uniqueCategories = [...new Set(existingCategories.filter(Boolean))];

  return (
    <Dialog open={!!channel} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-foreground">Save Creator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choose a category for <span className="text-gold">{channel.name}</span> or create a new one.
          </p>

          {/* Existing categories */}
          {uniqueCategories.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Your categories:</p>
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat && !isAddingCustom ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === cat && !isAddingCustom
                        ? "bg-gold text-primary-foreground"
                        : "border-gold/30 text-muted-foreground hover:text-gold hover:border-gold"
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsAddingCustom(false);
                    }}
                  >
                    {selectedCategory === cat && !isAddingCustom && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add custom category */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className={`border-gold/30 ${isAddingCustom ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-gold"}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new category
            </Button>

            {isAddingCustom && (
              <Input
                placeholder="Enter category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="border-gold/30 focus:border-gold"
                autoFocus
              />
            )}
          </div>

          {/* No category option */}
          <Badge
            variant={selectedCategory === null && !isAddingCustom ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedCategory === null && !isAddingCustom
                ? "bg-secondary text-foreground"
                : "border-gold/30 text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setSelectedCategory(null);
              setIsAddingCustom(false);
              setCustomCategory("");
            }}
          >
            No category
          </Badge>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gold/30">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveCreator.isPending}
            className="bg-gold hover:bg-gold/90"
          >
            {saveCreator.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Creator"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCreatorDialog;
