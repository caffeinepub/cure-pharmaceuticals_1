import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { useGetAllProducts } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ContactPage } from "./pages/ContactPage";

const queryClient = new QueryClient();

type Page = "home" | "products" | "contact" | "admin";

function checkAdminAccess() {
  return (
    window.location.hash === "#Alexx" ||
    window.location.search.includes("Alexx") ||
    window.location.pathname.endsWith("Alexx")
  );
}

function AppInner() {
  const [page, setPage] = useState<Page>("home");
  const [search, setSearch] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(checkAdminAccess);
  const { data: products = [], isLoading } = useGetAllProducts();

  useEffect(() => {
    const onHashChange = () => setAdminUnlocked(checkAdminAccess());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleNavigate = (p: Page) => {
    if (p === "admin" && !adminUnlocked) return;
    setPage(p);
    if (p !== "products" && p !== "home") setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    if (page === "contact") return <ContactPage />;
    if (page === "admin" && adminUnlocked) return <AdminPage />;
    return (
      <CatalogPage
        products={products}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={page}
        onNavigate={handleNavigate}
        search={search}
        onSearchChange={setSearch}
        adminUnlocked={adminUnlocked}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} adminUnlocked={adminUnlocked} />
      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppInner />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
