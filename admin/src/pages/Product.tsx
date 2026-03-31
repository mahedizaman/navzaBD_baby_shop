import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type RefName = { _id: string; name: string };

type ProductRow = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  discountPercentage?: number;
  image: string;
  category: RefName | string;
  brand: RefName | string;
};

type Category = { _id: string; name: string };
type Brand = { _id: string; name: string };

function refLabel(ref: ProductRow["category"]): string {
  if (!ref) return "—";
  if (typeof ref === "string") return ref || "—";
  // Backend populate might still return unexpected values; never assume `name` exists.
  return (ref as { name?: string } | undefined)?.name ?? "—";
}

const Product = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rowAction, setRowAction] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const editPreviewUrl = useRef<string | null>(null);

  const loadMeta = useCallback(async () => {
    const [catRes, brandRes] = await Promise.all([
      api.get<Category[]>("/api/categories"),
      api.get<Brand[]>("/api/brands"),
    ]);
    setCategories(catRes.data);
    setBrands(brandRes.data);
  }, []);

  const loadProducts = useCallback(async () => {
    const { data } = await api.get<{ products: ProductRow[]; total: number }>(
      "/api/products",
      { params: { page: 1, limit: 500, sortOrder: "desc" } },
    );
    setProducts(data.products);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingList(true);
        await Promise.all([loadMeta(), loadProducts()]);
      } catch {
        if (!cancelled) toast.error("Failed to load products or filters.");
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMeta, loadProducts]);

  function onSelectImage(file: File | null) {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    }
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrl.current = url;
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function onSelectEditImage(file: File | null) {
    if (editPreviewUrl.current) {
      URL.revokeObjectURL(editPreviewUrl.current);
      editPreviewUrl.current = null;
    }
    setEditImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      editPreviewUrl.current = url;
      setEditPreview(url);
    } else {
      setEditPreview(null);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required.");
      return;
    }
    if (price === "" || stock === "") {
      toast.error("Price and stock are required.");
      return;
    }
    if (!categoryId || !brandId) {
      toast.error("Category and brand are required.");
      return;
    }
    if (!imageFile) {
      toast.error("Please choose a product image.");
      return;
    }

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("description", description.trim());
    fd.append("price", String(Number(price)));
    fd.append("stock", String(Number(stock)));
    fd.append("discountPercentage", String(Number(discount) || 0));
    fd.append("categoryId", categoryId);
    fd.append("brandId", brandId);
    fd.append("image", imageFile);

    setSaving(true);
    try {
      await api.post("/api/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created.");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setDiscount("0");
      setCategoryId("");
      setBrandId("");
      onSelectImage(null);
      await loadProducts();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Create failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  function openEdit(p: ProductRow) {
    setEditing(p);
    setEditImageFile(null);
    if (editPreviewUrl.current) URL.revokeObjectURL(editPreviewUrl.current);
    editPreviewUrl.current = null;
    setEditPreview(null);
    setEditOpen(true);
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name.trim() || !editing.description?.trim()) {
      toast.error("Name and description are required.");
      return;
    }

    setSaving(true);
    setRowAction(editing._id);
    try {
      if (editImageFile) {
        const fd = new FormData();
        fd.append("name", editing.name.trim());
        fd.append("description", String(editing.description));
        fd.append("price", String(editing.price));
        fd.append("stock", String(editing.stock));
        fd.append(
          "discountPercentage",
          String(editing.discountPercentage ?? 0),
        );
        const cid =
          typeof editing.category === "object"
            ? editing.category._id
            : editing.category;
        const bid =
          typeof editing.brand === "object" ? editing.brand._id : editing.brand;
        fd.append("categoryId", String(cid));
        fd.append("brandId", String(bid));
        fd.append("image", editImageFile);
        await api.put(`/api/products/${editing._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const cid =
          typeof editing.category === "object"
            ? editing.category._id
            : editing.category;
        const bid =
          typeof editing.brand === "object" ? editing.brand._id : editing.brand;
        await api.put(`/api/products/${editing._id}`, {
          name: editing.name.trim(),
          description: editing.description,
          price: editing.price,
          stock: editing.stock,
          discountPercentage: editing.discountPercentage ?? 0,
          categoryId: cid,
          brandId: bid,
        });
      }
      toast.success("Product updated.");
      setEditOpen(false);
      setEditing(null);
      onSelectEditImage(null);
      await loadProducts();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Update failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
      setRowAction(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product permanently?")) return;
    setRowAction(id);
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted.");
      await loadProducts();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Delete failed.";
      toast.error(msg);
    } finally {
      setRowAction(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Product Management
      </h2>

      <form
        onSubmit={handleAddProduct}
        className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Price (৳)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Stock</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">
              Discount %
            </label>
            <input
              type="number"
              min={0}
              max={80}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Category</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories
                .filter((c): c is Category => Boolean(c && c._id))
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c?.name ?? "—"}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Brand</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option value="">Select brand</option>
              {brands
                .filter((b): b is Brand => Boolean(b && b._id))
                .map((b) => (
                  <option key={b._id} value={b._id}>
                    {b?.name ?? "—"}
                  </option>
                ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full text-sm"
              onChange={(e) =>
                onSelectImage(e.target.files?.[0] ?? null)
              }
            />
            {preview ? (
              <img
                src={preview}
                alt=""
                className="mt-2 h-24 w-24 rounded-lg object-cover border"
              />
            ) : null}
          </div>
        </div>
        <Button type="submit" className="mt-4 bg-indigo-600" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add Product"
          )}
        </Button>
      </form>

      <div className="overflow-x-auto shadow-lg rounded-lg border bg-white">
        {loadingList ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4">{refLabel(p.category)}</td>
                  <td className="py-3 px-4">{refLabel(p.brand)}</td>
                  <td className="py-3 px-4">৳{p.price}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                      onClick={() => openEdit(p)}
                      disabled={rowAction === p._id}
                    >
                      {rowAction === p._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-red-600 hover:underline"
                      onClick={() => void handleDelete(p._id)}
                      disabled={rowAction === p._id}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editOpen && editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Edit product
            </h3>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[72px]"
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Stock</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  New image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm"
                  onChange={(e) =>
                    onSelectEditImage(e.target.files?.[0] ?? null)
                  }
                />
                {editPreview ? (
                  <img
                    src={editPreview}
                    alt=""
                    className="mt-2 h-20 w-20 object-cover rounded-lg border"
                  />
                ) : (
                  <img
                    src={editing.image}
                    alt=""
                    className="mt-2 h-20 w-20 object-cover rounded-lg border"
                  />
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-indigo-600" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditOpen(false);
                    setEditing(null);
                    onSelectEditImage(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Product;
