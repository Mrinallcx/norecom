export interface Creator {
  id: string;
  name: string;
  avatar: string;
  category: string;
  subscribers: string;
  videoCount: number;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  creatorId: string;
  videoUrl: string;
}

export const categories = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Entertainment",
  "Technology",
  "Lifestyle",
];

export const creators: Creator[] = [
  {
    id: "1",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    category: "Music",
    subscribers: "2.4M",
    videoCount: 156,
    description: "Award-winning music producer sharing tutorials and behind-the-scenes content.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    category: "Technology",
    subscribers: "1.8M",
    videoCount: 243,
    description: "Tech reviewer and software engineer breaking down the latest innovations.",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    category: "Gaming",
    subscribers: "3.2M",
    videoCount: 512,
    description: "Pro gamer and streamer with epic gameplay and tutorials.",
  },
  {
    id: "4",
    name: "Elena Vasquez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    category: "Education",
    subscribers: "890K",
    videoCount: 89,
    description: "PhD in Physics making science accessible and fun for everyone.",
  },
  {
    id: "5",
    name: "James Wright",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    category: "Entertainment",
    subscribers: "4.1M",
    videoCount: 324,
    description: "Comedy sketches and viral entertainment content creator.",
  },
  {
    id: "6",
    name: "Mia Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    category: "Lifestyle",
    subscribers: "1.5M",
    videoCount: 198,
    description: "Wellness coach sharing daily routines and mindfulness practices.",
  },
  {
    id: "7",
    name: "David Park",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    category: "Technology",
    subscribers: "2.1M",
    videoCount: 167,
    description: "AI researcher and developer exploring the future of technology.",
  },
  {
    id: "8",
    name: "Luna Martinez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    category: "Music",
    subscribers: "980K",
    videoCount: 78,
    description: "Classical pianist bringing timeless music to modern audiences.",
  },
];

export const videos: Video[] = [
  // Alex Rivera's videos
  {
    id: "v1",
    title: "Creating a Hit Song from Scratch",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=225&fit=crop",
    duration: "24:35",
    views: "1.2M",
    creatorId: "1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "v2",
    title: "Music Production Tips for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop",
    duration: "18:22",
    views: "856K",
    creatorId: "1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "v3",
    title: "Studio Tour 2024",
    thumbnail: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=225&fit=crop",
    duration: "12:45",
    views: "2.1M",
    creatorId: "1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  // Sarah Chen's videos
  {
    id: "v4",
    title: "iPhone 16 Pro Max Review",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=225&fit=crop",
    duration: "22:18",
    views: "3.4M",
    creatorId: "2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "v5",
    title: "Best Coding Setup 2024",
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=225&fit=crop",
    duration: "15:33",
    views: "1.8M",
    creatorId: "2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  // Marcus Johnson's videos
  {
    id: "v6",
    title: "Elden Ring Boss Rush Challenge",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
    duration: "45:20",
    views: "4.2M",
    creatorId: "3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "v7",
    title: "Building the Ultimate Gaming PC",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=225&fit=crop",
    duration: "28:15",
    views: "2.8M",
    creatorId: "3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  // Elena Vasquez's videos
  {
    id: "v8",
    title: "Quantum Physics Explained Simply",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",
    duration: "32:45",
    views: "890K",
    creatorId: "4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  // James Wright's videos
  {
    id: "v9",
    title: "When Your WiFi Goes Down",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
    duration: "8:45",
    views: "5.6M",
    creatorId: "5",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  // Mia Thompson's videos
  {
    id: "v10",
    title: "Morning Routine for Success",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop",
    duration: "16:30",
    views: "1.4M",
    creatorId: "6",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  // David Park's videos
  {
    id: "v11",
    title: "The Future of AI in 2025",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    duration: "25:18",
    views: "2.3M",
    creatorId: "7",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  // Luna Martinez's videos
  {
    id: "v12",
    title: "Moonlight Sonata Performance",
    thumbnail: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=225&fit=crop",
    duration: "14:22",
    views: "780K",
    creatorId: "8",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export const getCreatorById = (id: string): Creator | undefined => {
  return creators.find((creator) => creator.id === id);
};

export const getVideosByCreatorId = (creatorId: string): Video[] => {
  return videos.filter((video) => video.creatorId === creatorId);
};

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((video) => video.id === id);
};
