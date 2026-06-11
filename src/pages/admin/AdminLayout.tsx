import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  ExternalLink, 
  Layers, 
  CalendarDays, 
  MessageSquare 
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const NavGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <span className="px-3 text-[10px] font-sans font-semibold text-white/40 uppercase tracking-widest block mb-2">
      {label}
    </span>
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

const NavItem = ({ href, icon: Icon, label, exact = false, badge = 0 }: { href: string, icon: any, label: string, exact?: boolean, badge?: number }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors relative ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md" />
      )}
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-white/40'}`} />
        <span className="font-sans text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

const AdminLayout = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const [postsRes, commentsRes] = await Promise.all([
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("approved", false),
        supabase.from("article_comments").select("id", { count: "exact", head: true }).eq("approved", false)
      ]);
      const totalPending = (postsRes.count ?? 0) + (commentsRes.count ?? 0);
      setPendingCount(totalPending);
    };
    fetchPendingCount();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-deep-brown flex-col hidden md:flex fixed inset-y-0 left-0 z-50">

        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MFM" className="h-8 w-auto opacity-80" />
            <div>
              <p className="font-serif text-white text-sm font-bold tracking-wider leading-none">MOUNTAIN</p>
              <p className="font-sans text-white/40 text-[9px] tracking-[0.3em] uppercase mt-0.5">Admin</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <NavGroup label="Content">
            <NavItem href="/admin" icon={LayoutDashboard} label="Overview" exact />
            <NavItem href="/admin/posts" icon={FileText} label="Posts" />
            <NavItem href="/admin/community" icon={MessageSquare} label="Community Posts" badge={pendingCount} />
          </NavGroup>
          <NavGroup label="Platform">
            <NavItem href="/admin/directory" icon={Layers} label="Directory" />
            <NavItem href="/admin/events" icon={CalendarDays} label="Events" />
            <NavItem href="/admin/newsletter" icon={Mail} label="Newsletter" />
          </NavGroup>
          <NavGroup label="System">
            <NavItem href="/admin/users" icon={Users} label="Users" />
          </NavGroup>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 font-sans text-xs text-white/40 hover:text-white/70 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            View live site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-60 min-h-screen bg-[#f7f5f2]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
