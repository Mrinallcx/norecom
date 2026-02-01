import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CreatorPage from "./pages/CreatorPage";
import YouTubeCreatorPage from "./pages/YouTubeCreatorPage";
import VideoPage from "./pages/VideoPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const CACHE_TIME = 1000 * 60 * 60 * 24 * 365; // 1 year

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: CACHE_TIME, // Garbage collection time (formerly cacheTime)
      staleTime: CACHE_TIME, // Consideration of data as fresh
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// App component with providers
const App = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/channel/:channelId" element={<YouTubeCreatorPage />} />
            <Route path="/creator/:id" element={<CreatorPage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </PersistQueryClientProvider>
);

export default App;
