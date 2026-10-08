import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { adminListCategories, adminUpsertCategory, adminDeleteCategory } from "@/lib/admin-db";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/admin/categories")({
  head: () => pageHead("Categories — Admin", "Manage categories", { noindex: true }),
  component: AdminCategories,
});

type Cat = { slug: string; name: string; description: string; featured: boolean };
const empty: Cat = { slug: "", name: "", description: "", featured: false };

function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Cat>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setCats(await adminListCategories());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function save() {
    setBusy(true);
    setError("");
    try {
      await adminUpsertCategory(form);
      setEditing(null);
      setAdding(false);
      setForm(empty);
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function del(slug: string, name: string) {
    if (!confirm(`Delete category "${name}"? Tools assigned to it will lose this category.`))
      return;
    setBusy(true);
    try {
      await adminDeleteCategory(slug);
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(cat: Cat) {
    setEditing(cat);
    setAdding(false);
    setForm({ ...cat });
  }
  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm(empty);
  }
  function cancel() {
    setEditing(null);
    setAdding(false);
    setForm(empty);
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>;

  const InlineForm = () => (
    <tr className="admin-inline-form">
      <td>
        <input
          className="admin-input"
          placeholder="slug-like-this"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
      </td>
      <td>
        <input
          className="admin-input"
          placeholder="Display name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </td>
      <td>
        <input
          className="admin-input"
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </td>
      <td>
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
        />
      </td>
      <td>
        <div className="admin-actions">
          <button title="Save" className="success" onClick={save} disabled={busy}>
            <Check size={13} />
          </button>
          <button title="Cancel" onClick={cancel}>
            <X size={13} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>{cats.length} categories</p>
        </div>
        <button className="admin-btn primary" onClick={startAdd}>
          <Plus size={15} /> Add category
        </button>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Name</th>
              <th>Description</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adding && <InlineForm />}
            {cats.map((cat) =>
              editing?.slug === cat.slug ? (
                <InlineForm key={cat.slug} />
              ) : (
                <tr key={cat.slug}>
                  <td className="font-mono text-xs">{cat.slug}</td>
                  <td>{cat.name}</td>
                  <td className="admin-cell-desc">{cat.description}</td>
                  <td>{cat.featured ? <Check size={14} className="text-primary" /> : "—"}</td>
                  <td>
                    <div className="admin-actions">
                      <button title="Edit" onClick={() => startEdit(cat)}>
                        <Pencil size={13} />
                      </button>
                      <button
                        title="Delete"
                        className="danger"
                        onClick={() => del(cat.slug, cat.name)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
