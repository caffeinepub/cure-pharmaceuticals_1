import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend";

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  onViewDetails,
}: ProductCardProps) {
  const [copied, setCopied] = useState(false);
  const productCode = `CURE-${String(product.id).padStart(6, "0")}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(productCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="bg-card rounded-lg border border-border shadow-card overflow-hidden flex flex-col transition-shadow hover:shadow-nav"
      data-ocid={`products.item.${index}`}
    >
      {/* Image */}
      <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
        {product.image1 ? (
          <img
            src={product.image1}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="text-4xl">💊</div>
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {product.brand}
        </div>
        <h3 className="font-bold text-foreground text-base leading-snug mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-mono text-muted-foreground">
            {productCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
            title="Copy product code"
            data-ocid="products.copy.button"
          >
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
        {product.strength && (
          <div className="text-xs text-muted-foreground mb-3">
            {product.strength}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="text-lg font-bold text-foreground">
            €{product.priceEur.toFixed(2)}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              product.inStock
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors"
          data-ocid="products.view.button"
        >
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}
