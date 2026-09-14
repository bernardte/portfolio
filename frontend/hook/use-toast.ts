import { toast } from "@/components/ui/toast";

export function useToast() {
    
   const success = (description: string) => {
     toast.add({
       type: "success",
       description
     });
   };

   const error = (description: string) => {
     toast.add({
       type: "error",
       description,
       priority: "high"
     });
   };

   const info = (description: string) => {
     toast.add({
       type: "info",
       description
     });
   };

   const warning = (description: string) => {
     toast.add({
       type: "warning",
       description
     });
   };

   const defaultToast = (description: string) => {
     toast.add({
       description
     });
   };

  return {
    success,
    error,
    info,
    warning,
    default: defaultToast
  };
}