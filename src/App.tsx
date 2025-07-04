import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// context
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TransactionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                {/* Public routes - redirect to dashboard if authenticated */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <SignUp />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected routes - require authentication */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TransactionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
    </ToastProvider>
  </AuthProvider>
);

export default App;
