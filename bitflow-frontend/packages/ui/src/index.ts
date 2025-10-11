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
export { DataTable } from "./components/DataTable";
export type { Column, DataTableProps } from "./components/DataTable";
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";
export { FileUpload } from "./components/FileUpload";
export type { FileUploadProps } from "./components/FileUpload";
export { Tabs } from "./components/Tabs";
export type { TabItem, TabsProps } from "./components/Tabs";
export { ToastProvider, useToast } from "./components/Toast";
export type { Toast } from "./components/Toast";
export { Breadcrumbs } from "./components/Breadcrumbs";
export type { BreadcrumbItem, BreadcrumbsProps } from "./components/Breadcrumbs";
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
