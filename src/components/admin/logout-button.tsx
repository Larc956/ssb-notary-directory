"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    toast.loading("Signing out...", { id: "logout" });
    await supabase.auth.signOut();
    toast.success("Signed out successfully.", { id: "logout" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-800">
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}