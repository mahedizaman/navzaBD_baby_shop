import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { api } from "@/lib/api";
import { getAdminUser, isAdminUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type Address = {
  _id?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
};

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  addresses?: Address[];
};

type UserCreatePayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  addresses?: Address[];
};

const ROLES = ["user", "admin", "deliveryman"] as const;

const Users = () => {
  const isAdmin = isAdminUser(getAdminUser());
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [rowAction, setRowAction] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<UserCreatePayload>({
    name: "",
    email: "",
    password: "",
    role: "user",
    addresses: [],
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserCreatePayload> & { avatar?: string }>({
    name: "",
    email: "",
    role: "user",
    avatar: "",
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{
        success: boolean;
        count: number;
        users: UserRow[];
      }>("/api/users");
      setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Failed to load users.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const addValid = useMemo(() => {
    const emailOk = addForm.email.trim().includes("@");
    return (
      addForm.name.trim().length > 0 &&
      emailOk &&
      addForm.password.trim().length >= 6 &&
      Boolean(addForm.role)
    );
  }, [addForm]);

  const editValid = useMemo(() => {
    const emailOk = (editForm.email ?? "").trim().includes("@");
    return Boolean(
      (editForm.name ?? "").trim().length > 0 &&
        emailOk &&
        (editForm.role ?? "").toString().trim().length > 0,
    );
  }, [editForm]);

  function openEdit(u: UserRow) {
    setEditing(u);
    setEditForm({
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar ?? "",
    });
    setEditOpen(true);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Permission denied.");
      return;
    }
    if (!addValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const payload: UserCreatePayload = {
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      password: addForm.password,
      role: addForm.role,
      addresses: [],
    };

    setSaving(true);
    try {
      await api.post("/api/users", payload);
      toast.success("User created.");
      setAddOpen(false);
      setAddForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        addresses: [],
      });
      await loadUsers();
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
    if (!isAdmin) {
      toast.error("Permission denied.");
      return;
    }
    if (!editing) return;
    if (!editValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const payload = {
      name: String(editForm.name ?? "").trim(),
      email: String(editForm.email ?? "").trim(),
      role: String(editForm.role ?? "").trim(),
      avatar: String(editForm.avatar ?? "").trim() || undefined,
    };

    setSaving(true);
    setRowAction(editing._id);
    try {
      await api.put(`/api/users/${editing._id}`, payload);
      toast.success("User updated.");
      setEditOpen(false);
      setEditing(null);
      await loadUsers();
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
    if (!isAdmin) {
      toast.error("Permission denied.");
      return;
    }
    if (!window.confirm("Delete this user permanently?")) return;
    setRowAction(id);
    setSaving(true);
    try {
      await api.delete(`/api/users/${id}`);
      toast.success("User deleted.");
      await loadUsers();
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
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <p className="text-gray-500 mt-1">
            Admin user management.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setAddOpen(true)}
          className="bg-indigo-600"
          disabled={!isAdmin}
        >
          + Add User
        </Button>
      </div>

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
                <th className="py-3 px-4 whitespace-nowrap">Email</th>
                <th className="py-3 px-4 whitespace-nowrap">Role</th>
                <th className="py-3 px-4 whitespace-nowrap">Avatar</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {u.name}
                  </td>
                  <td className="py-3 px-4 max-w-[240px] truncate">
                    {u.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
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
                        onClick={() => openEdit(u)}
                        disabled={!isAdmin || (rowAction === u._id && saving)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        onClick={() => void handleDelete(u._id)}
                        disabled={!isAdmin || (rowAction === u._id && saving)}
                      >
                        {rowAction === u._id && saving ? (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {/* Add modal */}
      {addOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add user</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, name: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, email: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, password: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Role</label>
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  value={addForm.role}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, role: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-indigo-600"
                  disabled={!isAdmin || !addValid || saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      {editOpen && editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit user</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={String(editForm.name ?? "")}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={String(editForm.email ?? "")}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, email: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Role</label>
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  value={String(editForm.role ?? "")}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, role: e.target.value }))
                  }
                  disabled={!isAdmin || saving}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Avatar URL (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={String(editForm.avatar ?? "")}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, avatar: e.target.value }))
                  }
                  placeholder="https://..."
                  disabled={!isAdmin || saving}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-indigo-600"
                  disabled={!isAdmin || !editValid || saving}
                >
                  {saving && rowAction === editing._id ? (
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

export default Users;

