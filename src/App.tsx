import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index.tsx";
import ArchivePage from "./pages/ArchivePage.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import MoodBoardPage from "./pages/MoodBoardPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminPosts from "./pages/admin/AdminPosts.tsx";
import AdminPostEditor from "./pages/admin/AdminPostEditor.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminNewsletter from "./pages/admin/AdminNewsletter.tsx";
import AdminDirectory from "./pages/admin/AdminDirectory.tsx";
import AdminEvents from "./pages/admin/AdminEvents.tsx";
import AdminCommunity from "./pages/admin/AdminCommunity.tsx";
import NotFound from "./pages/NotFound.tsx";

const DesignersPage = lazy(() => import("./pages/DesignersPage"));
const DesignerDetailPage = lazy(() => import("./pages/DesignerDetailPage"));
const ModelsPage = lazy(() => import("./pages/ModelsPage"));
const ModelDetailPage = lazy(() => import("./pages/ModelDetailPage"));
const ConsultancyPage = lazy(() => import("./pages/ConsultancyPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/archives/:category" element={<ArchivePage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/designers" element={<DesignersPage />} />
              <Route path="/designers/:slug" element={<DesignerDetailPage />} />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/models/:slug" element={<ModelDetailPage />} />
              <Route path="/consultancy" element={<ConsultancyPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route
                path="/mood-board"
                element={
                  <ProtectedRoute>
                    <MoodBoardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="posts/:id" element={<AdminPostEditor />} />
                <Route path="directory" element={<AdminDirectory />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
