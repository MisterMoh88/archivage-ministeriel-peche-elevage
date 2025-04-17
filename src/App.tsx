
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
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
              
              {/* Page 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
