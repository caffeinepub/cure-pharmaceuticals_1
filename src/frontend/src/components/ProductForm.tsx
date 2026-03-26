import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend";

interface ProductFormProps {
  initial?: Product | null;
  onSubmit: (product: Product) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

const EMPTY: Omit<Product, "id"> = {
  name: "",
  brand: "",
  category: "",
  strength: "",
  packaging: "",
  packSize: "",
  manufacturer: "",
  priceEur: 0,
  description: "",
  image1: "",
  image2: "",
  image3: "",
  inStock: true,
};

export function ProductForm({
  initial,
  onSubmit,
  onClose,
  isSubmitting,
}: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    initial ? { ...initial } : { ...EMPTY },
  );

  const set = (field: keyof typeof form, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...form, id: initial?.id ?? BigInt(0) });
  };

  const fields: {
    label: string;
    key: keyof typeof form;
    type?: string;
    placeholder?: string;
  }[] = [
    {
      label: "Product Name",
      key: "name",
      placeholder: "e.g. Amoxicillin 500mg",
    },
    { label: "Brand", key: "brand", placeholder: "e.g. GSK" },
    { label: "Category", key: "category", placeholder: "e.g. Antibiotics" },
    { label: "Strength", key: "strength", placeholder: "e.g. 500mg" },
    { label: "Packaging", key: "packaging", placeholder: "e.g. Blister pack" },
    { label: "Pack Size", key: "packSize", placeholder: "e.g. 28 capsules" },
    {
      label: "Manufacturer",
      key: "manufacturer",
      placeholder: "e.g. GlaxoSmithKline",
    },
    {
      label: "Price (EUR)",
      key: "priceEur",
      type: "number",
      placeholder: "0.00",
    },
    { label: "Image URL 1", key: "image1", placeholder: "https://..." },
    { label: "Image URL 2", key: "image2", placeholder: "https://..." },
    { label: "Image URL 3", key: "image3", placeholder: "https://..." },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
      data-ocid="admin.product.modal"
    >
      <div className="bg-card rounded-xl shadow-nav w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {initial ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="admin.product.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key} className="text-sm font-medium mb-1">
                {f.label}
              </Label>
              <Input
                id={f.key}
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={
                  f.type === "number"
                    ? String(form[f.key])
                    : (form[f.key] as string)
                }
                onChange={(e) =>
                  set(
                    f.key,
                    f.type === "number"
                      ? Number.parseFloat(e.target.value) || 0
                      : e.target.value,
                  )
                }
                className="bg-input border-border"
                data-ocid="admin.product.input"
              />
            </div>
          ))}

          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-1">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Product description…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="bg-input border-border resize-none"
              rows={3}
              data-ocid="admin.product.textarea"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="inStock"
              checked={form.inStock}
              onCheckedChange={(v) => set("inStock", Boolean(v))}
              data-ocid="admin.product.checkbox"
            />
            <Label
              htmlFor="inStock"
              className="text-sm font-medium cursor-pointer"
            >
              In Stock
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin.product.submit_button"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting
                ? "Saving..."
                : initial
                  ? "Update Product"
                  : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
