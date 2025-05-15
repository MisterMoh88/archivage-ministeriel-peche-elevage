
// Import directly from radix-ui
import { useToast as useToastOriginal } from "@radix-ui/react-toast";

// Re-export the hook
export const useToast = useToastOriginal;

// Export toast from the UI components
export { toast } from "@/components/ui/toast";
