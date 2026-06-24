import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button"; // <-- Import the button

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">SSB Directory Admin</h1>
        </div>
        <nav className="flex items-center text-sm font-medium space-x-6">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors">
            View Public Map
          </Link>
          <LogoutButton /> {/* <-- Drop it here */}
        </nav>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}