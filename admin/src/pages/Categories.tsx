import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type CategoryType = "Featured" | "Hot Categories" | "Top Categories";

type CategoryRow = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  categoryType: CategoryType;
};

const CATEGORY_TYPES: CategoryType[] = [
  "Featured",
  "Hot Categories",
  "Top Categories",
];

const Categories = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rowAction, setRowAction] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("Featured");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const editPreviewUrl = useRef<string | null>(null);

  const canSaveAdd = useMemo(() => {
    return Boolean(name.trim()) && Boolean(categoryType);
  }, [name, categoryType]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<CategoryRow[]>("/api/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Failed to load categories.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function cleanupUrl(urlRef: MutableRefObject<string | null>) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  }

  function onSelectImage(file: File | null) {
    cleanupUrl(previewUrl);
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrl.current = url;
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function openEdit(c: CategoryRow) {
    setEditing(c);
    setEditImageFile(null);
    cleanupUrl(editPreviewUrl);
    setEditPreview(null);
    setEditOpen(true);
  }

  function onSelectEditImage(file: File | null) {
    cleanupUrl(editPreviewUrl);
    setEditImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      editPreviewUrl.current = url;
      setEditPreview(url);
    } else {
      setEditPreview(null);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      toast.error("Category name is required.");
      return;
    }
    if (!categoryType) {
      toast.error("Category type is required.");
      return;
    }
    if (!imageFile) {
      toast.error("Please choose a category image.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", cleanName);
      if (cleanDescription) fd.append("description", cleanDescription);
      fd.append("categoryType", categoryType);
      fd.append("image", imageFile);

      await api.post("/api/categories", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category created.");
      setName("");
      setDescription("");
      setCategoryType("Featured");
      onSelectImage(null);
      await load();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Create failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const cleanName = editing.name.trim();
    const cleanDescription = editing.description?.trim() ?? "";
    if (!cleanName) {
      toast.error("Category name is required.");
      return;
    }
    if (!editing.categoryType) {
      toast.error("Category type is required.");
      return;
    }

    setSaving(true);
    setRowAction(editing._id);
    try {
      const fd = new FormData();
      fd.append("name", cleanName);
      if (cleanDescription) fd.append("description", cleanDescription);
      fd.append("categoryType", editing.categoryType);
      if (editImageFile) fd.append("image", editImageFile);

      await api.put(`/api/categories/${editing._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category updated.");
      setEditOpen(false);
      setEditing(null);
      onSelectEditImage(null);
      await load();
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
    if (!window.confirm("Delete this category permanently?")) return;
    setRowAction(id);
    setSaving(true);
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success("Category deleted.");
      await load();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Delete failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
      setRowAction(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Categories
          </h2>
          <p className="text-gray-500 mt-1">Manage category directory.</p>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-medium text-gray-500">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diapers"
            />
          </div>

          <div className="md:col-span-1">
            <label className="text-xs font-medium text-gray-500">
              Category Type
            </label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
              value={categoryType}
              onChange={(e) =>
                setCategoryType(e.target.value as CategoryType)
              }
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">
              Description (optional)
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short category description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">
              Image
            </label>
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
                alt="preview"
                className="mt-3 h-24 w-24 rounded-lg object-cover border bg-white"
              />
            ) : null}
          </div>
        </div>
        <Button
          type="submit"
          className="mt-5 bg-indigo-600"
          disabled={!canSaveAdd || saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add Category"
          )}
        </Button>
      </form>

      <div className="overflow-x-auto shadow-lg rounded-lg border bg-white">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Name</th>
                <th className="py-3 px-4 whitespace-nowrap">Type</th>
                <th className="py-3 px-4 whitespace-nowrap">Description</th>
                <th className="py-3 px-4 whitespace-nowrap">Image</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {c.categoryType}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[320px] truncate">
                    {c.description ?? "—"}
                  </td>
                  <td className="py-3 px-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        className="h-10 w-10 rounded object-cover border bg-white"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                        onClick={() => openEdit(c)}
                        disabled={rowAction === c._id && saving}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        onClick={() => void handleDelete(c._id)}
                        disabled={rowAction === c._id && saving}
                      >
                        {rowAction === c._id && saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {editOpen && editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Edit category
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3">
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
                <label className="text-xs text-gray-500">
                  Description
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm min-h-[72px]"
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Category Type
                </label>
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  value={editing.categoryType}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      categoryType: e.target.value as CategoryType,
                    })
                  }
                >
                  {CATEGORY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                    alt="preview"
                    className="mt-2 h-20 w-20 object-cover rounded-lg border bg-white"
                  />
                ) : editing.image ? (
                  <img
                    src={editing.image}
                    alt=""
                    className="mt-2 h-20 w-20 object-cover rounded-lg border bg-white"
                  />
                ) : null}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-indigo-600"
                  disabled={saving}
                >
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

export default Categories;

