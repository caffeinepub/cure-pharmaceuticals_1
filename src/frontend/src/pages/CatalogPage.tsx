import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";

interface CatalogPageProps {
  products: Product[];
  isLoading: boolean;
  search: string;
  onSearchChange: (s: string) => void;
  onNavigate: (page: "home" | "products" | "contact" | "admin") => void;
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export function CatalogPage({
  products,
  isLoading,
  search,
  onSearchChange,
  onNavigate,
}: CatalogPageProps) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean)),
    ).sort();
    return ["All", ...cats];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesSearch = (() => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.strength.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    })();
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[420px]">
            <motion.div
              className="flex flex-col justify-center py-16 pr-8"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block bg-accent/15 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                Trusted Pharmaceutical Supplier
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                Your Trusted
                <br />
                <span className="text-primary">Pharmaceutical</span>
                <br />
                Partner
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                Providing high-quality, licensed pharmaceutical products to
                healthcare professionals worldwide. Reliable supply, competitive
                pricing.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("products")}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
                  data-ocid="hero.primary_button"
                >
                  Browse Products
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="border border-border text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-muted transition-colors"
                  data-ocid="hero.secondary_button"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src="/assets/generated/pharma-hero.dim_800x600.jpg"
                alt="Pharmaceutical laboratory"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/60 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-ocid="products.section"
      >
        {/* Inline search bar */}
        <div className="relative mb-5" data-ocid="catalog.search_input">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search products by name, brand, strength…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-11 bg-card border-border text-sm"
          />
        </div>

        {/* Category chips */}
        {categories.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
            data-ocid="catalog.tab"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
                data-ocid="catalog.tab"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {search
              ? `Results for "${search}"${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`
              : activeCategory !== "All"
                ? activeCategory
                : "All Products"}
          </h2>
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {filtered.length} products
            </span>
          )}
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="products.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-9 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">
              Try a different search term or category
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            data-ocid="products.list"
          >
            {filtered.map((p, i) => (
              <ProductCard
                key={String(p.id)}
                product={p}
                index={i + 1}
                onViewDetails={setSelected}
              />
            ))}
          </motion.div>
        )}
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
