import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { adminGetTool, adminUpdateTool, type ToolRecord } from '@/lib/admin-db';
import { pageHead } from '@/lib/metadata';
import { ToolForm } from '@/components/admin/tool-form';

export const Route = createFileRoute('/admin/tools/$slug/edit')({
  head: ({ params }) => pageHead(`Edit ${params.slug} — Admin`, 'Edit AI tool', { noindex: true }),
  component: EditTool,
});

function EditTool() {
  const { slug } = Route.useParams();
  const navigate  = useNavigate();
  const [tool,    setTool]    = useState<ToolRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    adminGetTool(slug)
      .then(t => setTool(t as ToolRecord))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="admin-page-loading">Loading tool…</div>;
  if (error)   return <div className="admin-error">Error: {error}</div>;
  if (!tool)   return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Edit: {tool.name}</h1>
        <p>/tool/{slug}</p>
      </div>
      <ToolForm
        initialData={tool}
        onSave={async (data) => {
          await adminUpdateTool(slug, data);
          navigate({ to: '/admin/tools' });
        }}
      />
    </div>
  );
}
