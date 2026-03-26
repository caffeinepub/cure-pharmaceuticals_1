import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Copy, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const images = [product.image1, product.image2, product.image3].filter(
    Boolean,
  );
  const [imgIndex, setImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const productCode = `CURE-${String(product.id).padStart(6, "0")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(productCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const prev = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setImgIndex((i) => (i + 1) % images.length);

  const fields = [
    { label: "Brand", value: product.brand },
    { label: "Strength", value: product.strength },
    { label: "Packaging", value: product.packaging },
    { label: "Pack Size", value: product.packSize },
    { label: "Manufacturer", value: product.manufacturer },
    { label: "Price", value: `€${product.priceEur.toFixed(2)}` },
  ];

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 w-full h-full max-w-full max-h-full m-0 border-0"
      data-ocid="products.modal"
    >
      <div className="bg-card rounded-xl shadow-nav w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {product.brand}
            </p>
            <h2 className="text-xl font-bold text-foreground mt-0.5">
              {product.name}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-mono text-muted-foreground">
                {productCode}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
                title="Copy product code"
                data-ocid="products.modal.copy.button"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            data-ocid="products.modal.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image carousel */}
        {images.length > 0 && (
          <div className="relative mx-6 mb-4 bg-muted rounded-lg overflow-hidden h-56">
            <img
              src={images[imgIndex]}
              alt={`${product.name} ${imgIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1 hover:bg-card transition-colors"
                  data-ocid="products.modal.button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1 hover:bg-card transition-colors"
                  data-ocid="products.modal.button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((img, i) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setImgIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? "bg-primary" : "bg-primary/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Fields */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {fields.map(
              (f) =>
                f.value && (
                  <div key={f.label} className="bg-muted rounded-md p-3">
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">
                      {f.label}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {f.value}
                    </div>
                  </div>
                ),
            )}
            {/* Product Code field */}
            <div className="bg-muted rounded-md p-3">
              <div className="text-xs text-muted-foreground font-medium mb-0.5">
                Product Code
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono font-semibold text-foreground">
                  {productCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded flex-shrink-0"
                  title="Copy product code"
                  data-ocid="products.modal.copy.button"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                product.inStock
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </span>
          </div>

          {product.description && (
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Description
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Button
            type="button"
            onClick={onClose}
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="products.modal.close_button"
          >
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
