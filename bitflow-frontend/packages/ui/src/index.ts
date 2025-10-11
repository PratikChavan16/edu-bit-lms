// New Glassmorphic Components (Week 1 - Ameya)
export { Button } from "./components/Button";
export { Input } from "./components/Input";
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./components/Card";
export { ProtectedRoute } from "./components/ProtectedRoute";

// Auth Provider
export { AuthProvider, useAuth } from "./providers/AuthProvider";

// Utils
export { cn } from "./lib/utils";

// Examples (for reference)
export { LoginPageExample } from "./examples/LoginPageExample";

// Legacy components (keep for compatibility)
export * from "./components/badge";
export * from "./components/separator";
export * from "./components/table";
export * from "./components/switch";
export * from "./components/chart-preview";
export * from "./components/timeline";
export * from "./components/label";
export * from "./components/select";
export * from "./components/textarea";
export * from "./providers/theme-provider";
