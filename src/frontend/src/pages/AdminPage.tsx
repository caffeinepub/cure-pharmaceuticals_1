import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Lock, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { ProductForm } from "../components/ProductForm";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProduct,
} from "../hooks/useQueries";

const ADMIN_KEY = "cp_admin_auth";
const ADMIN_USER = "Alex";
const ADMIN_PASS = "thomas202611m";

function LoginCard({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem(ADMIN_KEY, "1");
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-24">
      <div className="bg-card rounded-2xl border border-border shadow-card p-10">
        <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-6">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Enter your credentials to access the admin panel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Username"
              autoComplete="username"
              data-ocid="admin.login.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              autoComplete="current-password"
              data-ocid="admin.login.input"
            />
          </div>
          {error && (
            <p
              className="text-sm text-destructive font-medium"
              data-ocid="admin.login.error_state"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="admin.login.submit_button"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Logging in…" : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(ADMIN_KEY) === "1",
  );

  const { data: products = [], isLoading: productsLoading } =
    useGetAllProducts();
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
  };

  const handleSubmit = async (product: Product) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync(product);
        toast.success("Product updated successfully");
      } else {
        await addMutation.mutateAsync(product);
        toast.success("Product added successfully");
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!authed) {
    return <LoginCard onLogin={() => setAuthed(true)} />;
  }

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="admin.panel"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products.length} products in catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="admin.add.primary_button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            data-ocid="admin.logout.button"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {productsLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-16 bg-card rounded-xl border border-border"
          data-ocid="admin.empty_state"
        >
          <div className="text-4xl mb-3">📦</div>
          <p className="font-medium text-foreground">No products yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Add your first product to get started
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <table className="w-full text-sm" data-ocid="admin.products.table">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Product
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                  Brand
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">
                  Stock
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={String(p.id)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  data-ocid={`admin.products.row.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image1 ? (
                        <img
                          src={p.image1}
                          alt={p.name}
                          className="w-10 h-10 rounded-md object-cover bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xl">
                          💊
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">
                          {p.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.strength}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {p.brand}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell font-semibold">
                    €{p.priceEur.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge
                      className={
                        p.inStock
                          ? "bg-success/15 text-success border-success/30 hover:bg-success/20"
                          : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"
                      }
                      variant="outline"
                    >
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="h-8 px-3"
                        data-ocid={`admin.products.edit_button.${i + 1}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(p)}
                        className="h-8 px-3 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                        data-ocid={`admin.products.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          initial={editing}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.delete.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
