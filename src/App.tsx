import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import DocumentViewerPage from "./pages/DocumentViewerPage";

// Pages
import Dashboard from "./pages/Dashboard";
import Archives from "./pages/Archives";
import Documents from "./pages/Documents";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Users from "./pages/Users";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a new QueryClient with optimized configuration to prevent excessive refreshes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 30, // 30 minutes
      refetchInterval: false,     // Disable automatic refetching
      refetchOnMount: true,       // Only refetch on component mount
      refetchOnReconnect: false,  // Don't refetch on reconnect
    },
  },
});

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Routes protégées avec MainLayout */}
                <Route path="/" element={
                  <AuthGuard>
                    <MainLayout><Dashboard /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/archives" element={
                  <AuthGuard>
                    <MainLayout><Archives /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/documents" element={
                  <AuthGuard>
                    <MainLayout><Documents /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/upload" element={
                  <AuthGuard>
                    <MainLayout><Upload /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/search" element={
                  <AuthGuard>
                    <MainLayout><Search /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/stats" element={
                  <AuthGuard>
                    <MainLayout><Stats /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/users" element={
                  <AuthGuard>
                    <MainLayout><Users /></MainLayout>
                  </AuthGuard>
                } />
                <Route path="/admin" element={
                  <AuthGuard>
                    <MainLayout><Admin /></MainLayout>
                  </AuthGuard>
                } />
                
                {/* Page de visualisation PDF en plein écran */}
                <Route path="/document-viewer" element={
                  <AuthGuard>
                    <DocumentViewerPage />
                  </AuthGuard>
                } />
                
                {/* Page 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueryClientProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
