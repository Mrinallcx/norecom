import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
}

const VideoPlayer = ({ videoUrl, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, that's okay
      });
    }
  }, [videoUrl]);

  return (
    <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden shadow-gold">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        controls
        autoPlay
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
