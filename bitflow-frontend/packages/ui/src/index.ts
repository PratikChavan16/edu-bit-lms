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
export { Alert } from "./components/Alert";
export { Spinner } from "./components/Spinner";
export { Checkbox } from "./components/Checkbox";
export { Modal } from "./components/Modal";
export { Textarea } from "./components/Textarea";
export { Select } from "./components/Select";
export { RadioGroup } from "./components/Radio";
export { ProtectedRoute, withAuth, useRouteAccess } from "./components/ProtectedRoute";

// Auth Context & Provider
export { AuthProvider, useAuth } from "./context/AuthContext";

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
export * from "./providers/theme-provider";
