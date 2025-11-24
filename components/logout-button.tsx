"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/clients";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout} className="cursor-pointer bg-red-600 flex items-center gap-2">
    <LogOut />
    <p>Logout</p>
    </Button>
}