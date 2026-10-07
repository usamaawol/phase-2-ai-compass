import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { adminCreateTool } from '@/lib/admin-db';
import { pageHead } from '@/lib/metadata';
import { ToolForm } from '@/components/admin/tool-form';

export const Route = createFileRoute('/admin/tools/new')({
  head: () => pageHead('Add AI Tool — Admin', 'Add a new AI tool', { noindex: true }),
  component: NewTool,
});

function NewTool() {
  const navigate = useNavigate();
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Add AI Tool</h1>
        <p>New tools are saved as drafts until published.</p>
      </div>
      <ToolForm
        onSave={async (data) => {
          await adminCreateTool(data);
          navigate({ to: '/admin/tools' });
        }}
      />
    </div>
  );
}
