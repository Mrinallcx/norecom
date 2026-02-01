import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SavedCreator {
  id: string;
  user_id: string;
  channel_id: string;
  channel_name: string;
  channel_avatar: string | null;
  subscriber_count: string | null;
  video_count: number | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

export const useSavedCreators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedCreators = [], isLoading } = useQuery({
    queryKey: ["saved-creators", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_creators")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SavedCreator[];
    },
    enabled: !!user,
  });

  const saveCreator = useMutation({
    mutationFn: async (creator: Omit<SavedCreator, "id" | "user_id" | "created_at">) => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase.from("saved_creators").insert({
        user_id: user.id,
        channel_id: creator.channel_id,
        channel_name: creator.channel_name,
        channel_avatar: creator.channel_avatar,
        subscriber_count: creator.subscriber_count,
        video_count: creator.video_count,
        description: creator.description,
        category: creator.category,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-creators"] });
      toast({
        title: "Creator saved!",
        description: "This creator has been added to your dashboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeCreator = useMutation({
    mutationFn: async (channelId: string) => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from("saved_creators")
        .delete()
        .eq("channel_id", channelId)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-creators"] });
      toast({
        title: "Creator removed",
        description: "This creator has been removed from your dashboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isCreatorSaved = (channelId: string) => {
    return savedCreators.some((c) => c.channel_id === channelId);
  };

  return {
    savedCreators,
    isLoading,
    saveCreator,
    removeCreator,
    isCreatorSaved,
  };
};
