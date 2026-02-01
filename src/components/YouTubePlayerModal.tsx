import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface YouTubePlayerModalProps {
  videoId: string | null;
  videoTitle?: string;
  onClose: () => void;
}

const YouTubePlayerModal = ({ videoId, videoTitle, onClose }: YouTubePlayerModalProps) => {
  if (!videoId) return null;

  return (
    <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-gold/20 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{videoTitle || "Video Player"}</DialogTitle>
        </VisuallyHidden>
        
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={videoTitle || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayerModal;
