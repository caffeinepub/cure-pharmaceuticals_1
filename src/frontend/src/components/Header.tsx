import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, Search, ShieldCheck } from "lucide-react";

type Page = "home" | "products" | "contact" | "admin";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  search: string;
  onSearchChange: (v: string) => void;
  adminUnlocked: boolean;
}

export function Header({
  currentPage,
  onNavigate,
  search,
  onSearchChange,
  adminUnlocked,
}: HeaderProps) {
  const navLinks: { label: string; page: Page }[] = [
    { label: "HOME", page: "home" },
    { label: "PRODUCTS", page: "products" },
    { label: "CONTACT", page: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 shrink-0"
            data-ocid="nav.link"
          >
            <div className="bg-primary rounded-lg p-1.5">
              <FlaskConical className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-foreground text-base tracking-tight">
                Cure
              </div>
              <div className="text-muted-foreground text-[10px] tracking-widest uppercase -mt-0.5">
                Pharmaceuticals
              </div>
            </div>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => onNavigate(link.page)}
                data-ocid="nav.link"
                className={`px-3 py-2 text-sm font-semibold tracking-wide rounded-md transition-colors ${
                  currentPage === link.page
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
            {adminUnlocked && (
              <button
                type="button"
                onClick={() => onNavigate("admin")}
                data-ocid="nav.link"
                className={`px-3 py-2 text-sm font-semibold tracking-wide rounded-md transition-colors ${
                  currentPage === "admin"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                ADMIN
              </button>
            )}
          </nav>

          {/* Search + Admin button */}
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicines…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-48 lg:w-64 bg-input border-border text-sm h-9"
                data-ocid="header.search_input"
              />
            </div>
            {adminUnlocked && (
              <Button
                type="button"
                onClick={() => onNavigate("admin")}
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 text-sm font-semibold shrink-0"
                data-ocid="header.admin.button"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                Admin Panel
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
