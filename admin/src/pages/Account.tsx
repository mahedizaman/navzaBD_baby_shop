import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Address = {
  _id: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
};

type Profile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  addresses?: Address[];
  address?: Address[]; // legacy fallback
};

const Account = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const addresses = useMemo(() => {
    if (!profile) return [];
    return (profile.addresses ?? profile.address ?? []) as Address[];
  }, [profile]);

  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [addressModal, setAddressModal] = useState<
    | { mode: "add" }
    | { mode: "edit"; address: Address }
    | null
  >(null);

  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Profile>("/api/auth/profile");
      setProfile(res.data);
      setEditProfile({
        name: res.data.name ?? "",
        email: res.data.email ?? "",
        avatar: res.data.avatar ?? "",
      });
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Failed to load profile.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const addressValid = useMemo(() => {
    return (
      addressForm.street.trim().length > 0 &&
      addressForm.city.trim().length > 0 &&
      addressForm.country.trim().length > 0 &&
      addressForm.postalCode.trim().length > 0
    );
  }, [addressForm]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const cleanName = editProfile.name.trim();
    const cleanEmail = editProfile.email.trim();

    if (!cleanName) {
      toast.error("Name is required.");
      return;
    }
    if (!cleanEmail.includes("@")) {
      toast.error("Valid email is required.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/users/${profile._id}`, {
        name: cleanName,
        email: cleanEmail,
        avatar: editProfile.avatar.trim() || undefined,
      });
      toast.success("Profile updated.");
      await loadProfile();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Update failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  function openAddAddress() {
    setAddressModal({ mode: "add" });
    setAddressForm({
      street: "",
      city: "",
      country: "",
      postalCode: "",
      isDefault: addresses.length === 0,
    });
  }

  function openEditAddress(a: Address) {
    setAddressModal({ mode: "edit", address: a });
    setAddressForm({
      street: a.street,
      city: a.city,
      country: a.country,
      postalCode: a.postalCode,
      isDefault: Boolean(a.isDefault),
    });
  }

  function closeAddressModal() {
    setAddressModal(null);
  }

  async function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !addressModal) return;
    if (!addressValid) {
      toast.error("All address fields are required.");
      return;
    }

    const payload = {
      street: addressForm.street.trim(),
      city: addressForm.city.trim(),
      country: addressForm.country.trim(),
      postalCode: addressForm.postalCode.trim(),
      isDefault: Boolean(addressForm.isDefault),
    };

    setSaving(true);
    try {
      if (addressModal.mode === "add") {
        await api.post(`/api/users/${profile._id}/addresses`, payload);
        toast.success("Address added.");
      } else {
        await api.put(
          `/api/users/${profile._id}/addresses/${addressModal.address._id}`,
          payload,
        );
        toast.success("Address updated.");
      }
      closeAddressModal();
      await loadProfile();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Request failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!profile) return;
    if (!window.confirm("Delete this address?")) return;
    setSaving(true);
    try {
      await api.delete(`/api/users/${profile._id}/addresses/${id}`);
      toast.success("Address deleted.");
      await loadProfile();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Delete failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account</h2>
          <p className="text-gray-500 mt-1">
            Admin profile and addresses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Profile
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Name
                </label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={editProfile.name}
                  onChange={(e) =>
                    setEditProfile((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={editProfile.email}
                  onChange={(e) =>
                    setEditProfile((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                Avatar URL (optional)
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                value={editProfile.avatar}
                onChange={(e) =>
                  setEditProfile((p) => ({ ...p, avatar: e.target.value }))
                }
                placeholder="https://..."
              />
              {editProfile.avatar.trim() ? (
                <img
                  src={editProfile.avatar.trim()}
                  alt=""
                  className="mt-3 h-16 w-16 rounded object-cover border bg-white"
                />
              ) : profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt=""
                  className="mt-3 h-16 w-16 rounded object-cover border bg-white"
                />
              ) : null}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="bg-indigo-600"
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Addresses
          </h3>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {addresses.length} total
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={openAddAddress}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-sm text-gray-500">
              No addresses yet.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div
                  key={a._id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {a.street}, {a.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {a.country} - {a.postalCode}
                      </p>
                      {a.isDefault ? (
                        <span className="inline-flex mt-2 px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                        onClick={() => openEditAddress(a)}
                        disabled={saving}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        onClick={() => void handleDeleteAddress(a._id)}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit address modal */}
      {addressModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {addressModal.mode === "add" ? "Add address" : "Edit address"}
            </h3>
            <form onSubmit={submitAddress} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Street</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      street: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">City</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Country</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm((p) => ({
                        ...p,
                        country: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Postal Code</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      isDefault: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm text-gray-700">Set as default</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-indigo-600"
                  disabled={!addressValid || saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={closeAddressModal}>
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

export default Account;

