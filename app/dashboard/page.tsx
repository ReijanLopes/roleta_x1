import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListDashboard from "./list";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <section className="bg-black bg-gradient-to-br to-blue-500 from-30% from-transparent">
      <div className="max-w-4xl pt-6 px-8 mx-auto flex justify-end">
         <LogoutButton />
      </div>
      <ListDashboard />
    </section>
  );
}


