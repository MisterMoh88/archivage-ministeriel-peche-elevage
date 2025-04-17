
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";

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
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Routes avec MainLayout */}
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/archives" element={<MainLayout><Archives /></MainLayout>} />
            <Route path="/documents" element={<MainLayout><Documents /></MainLayout>} />
            <Route path="/upload" element={<MainLayout><Upload /></MainLayout>} />
            <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
            <Route path="/stats" element={<MainLayout><Stats /></MainLayout>} />
            <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
            <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
            
            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
