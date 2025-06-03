
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { DailyLog } from "./pages/DailyLog";
import { ContestLog } from "./pages/ContestLog";
import { WeeklyGoals } from "./pages/WeeklyGoals";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - redirect to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} 
      />
      <Route 
        path="/forgot-password" 
        element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/daily-log" 
        element={
          <ProtectedRoute>
            <DailyLog />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contest-log" 
        element={
          <ProtectedRoute>
            <ContestLog />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/weekly-goals" 
        element={
          <ProtectedRoute>
            <WeeklyGoals />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirects */}
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="lovable-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
