/**
 * Reusable tool add/edit form.
 * Covers every editable field on ToolRecord.
 */
import { useState } from 'react';
import { type ToolRecord } from '@/lib/admin-db';
import { categories } from '@/lib/catalog';

type FormData = Partial<ToolRecord> & { name: string };

interface Props {
  initialData?: ToolRecord;
  onSave: (data: FormData) => Promise<void>;
}

const PLATFORMS = ['Web','Android','iOS','Windows','macOS','Linux','CLI','Browser Extension','Desktop','API'];
const PRICING_TYPES = ['Free','Freemium','Paid','Free trial','Open source','Check official website'];
const VERIF_STATUSES: ToolRecord['verification_status'][] = ['verified','partially_verified','needs_review','unverified'];
const STATUSES: ToolRecord['status'][] = ['draft','published','archived'];

/** Tiny helper: comma-separated string ↔ string[] */
function arrToStr(a: string[] | undefined) { return (a ?? []).join(', '); }
function strToArr(s: string) { return s.split(',').map(x => x.trim()).filter(Boolean); }

export function ToolForm({ initialData, onSave }: Props) {
  const [form,    setForm]    = useState<FormData>({
    name:                 initialData?.name                 ?? '',
    slug:                 initialData?.slug                 ?? '',
    company:              initialData?.company              ?? '',
    tagline:              initialData?.tagline              ?? '',
    short_description:    initialData?.short_description    ?? '',
    long_description:     initialData?.long_description     ?? '',
    official_url:         initialData?.official_url         ?? '',
    official_pricing_url: initialData?.official_pricing_url ?? '',
    official_docs_url:    initialData?.official_docs_url    ?? '',
    categories:           initialData?.categories           ?? [],
    tags:                 initialData?.tags                 ?? [],
    platforms:            initialData?.platforms            ?? [],
    pricing_type:         initialData?.pricing_type         ?? 'Check official website',
    free_plan:            initialData?.free_plan            ?? null,
    open_source:          initialData?.open_source          ?? false,
    api_available:        initialData?.api_available        ?? null,
    skill_level:          initialData?.skill_level          ?? 'Beginner',
    key_features:         initialData?.key_features         ?? [],
    strengths:            initialData?.strengths            ?? [],
    limitations:          initialData?.limitations          ?? [],
    target_users:         initialData?.target_users         ?? [],
    getting_started:      initialData?.getting_started      ?? [],
    history:              initialData?.history              ?? '',
    launch_year:          initialData?.launch_year          ?? null,
    founded_year:         initialData?.founded_year         ?? null,
    alternatives:         initialData?.alternatives         ?? [],
    is_featured:          initialData?.is_featured          ?? false,
    featured_order:       initialData?.featured_order       ?? 999,
    is_trending:          initialData?.is_trending          ?? false,
    verification_status:  initialData?.verification_status  ?? 'unverified',
    status:               initialData?.status               ?? 'draft',
  });
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await onSave(form); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
      <div className="admin-field">
        <label className="admin-field-label">{label}</label>
        {children}
        {hint && <p className="admin-field-hint">{hint}</p>}
      </div>
    );
  }

  function Input({ field, ...rest }: { field: keyof FormData } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        className="admin-input"
        value={(form[field] as string | number) ?? ''}
        onChange={e => set(field, e.target.value as FormData[typeof field])}
        {...rest}
      />
    );
  }

  function Textarea({ field, rows = 3 }: { field: keyof FormData; rows?: number }) {
    return (
      <textarea
        className="admin-input admin-textarea"
        rows={rows}
        value={(form[field] as string) ?? ''}
        onChange={e => set(field, e.target.value as FormData[typeof field])}
      />
    );
  }

  function CSVField({ label, field, hint }: { label: string; field: keyof FormData; hint?: string }) {
    return (
      <Field label={label} hint={hint ?? 'Comma-separated'}>
        <input
          className="admin-input"
          value={arrToStr(form[field] as string[])}
          onChange={e => set(field, strToArr(e.target.value) as FormData[typeof field])}
        />
      </Field>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">

      {/* ── Identity ── */}
      <section className="admin-form-section">
        <h2>Identity</h2>
        <div className="admin-form-grid">
          <Field label="Name *">
            <Input field="name" required placeholder="e.g. ChatGPT" />
          </Field>
          <Field label="Slug" hint="Auto-generated from name if left blank">
            <Input field="slug" placeholder="e.g. chatgpt" />
          </Field>
          <Field label="Company">
            <Input field="company" placeholder="e.g. OpenAI" />
          </Field>
          <Field label="Launch year">
            <Input field="launch_year" type="number" placeholder="e.g. 2022" />
          </Field>
          <Field label="Founded year">
            <Input field="founded_year" type="number" placeholder="e.g. 2015" />
          </Field>
        </div>
        <Field label="Tagline">
          <Input field="tagline" placeholder="One-line description" />
        </Field>
        <Field label="Short description">
          <Textarea field="short_description" />
        </Field>
        <Field label="Long description">
          <Textarea field="long_description" rows={5} />
        </Field>
        <Field label="History / background">
          <Textarea field="history" rows={3} />
        </Field>
      </section>

      {/* ── Official links ── */}
      <section className="admin-form-section">
        <h2>Official links</h2>
        <div className="admin-form-grid">
          <Field label="Official website URL *">
            <Input field="official_url" type="url" placeholder="https://" required />
          </Field>
          <Field label="Pricing page URL">
            <Input field="official_pricing_url" type="url" placeholder="https://" />
          </Field>
          <Field label="Docs URL">
            <Input field="official_docs_url" type="url" placeholder="https://" />
          </Field>
        </div>
      </section>

      {/* ── Classification ── */}
      <section className="admin-form-section">
        <h2>Classification</h2>

        <Field label="Categories">
          <div className="admin-checkbox-grid">
            {categories.map(c => (
              <label key={c.slug} className="admin-check-label">
                <input
                  type="checkbox"
                  checked={(form.categories ?? []).includes(c.slug)}
                  onChange={e => {
                    const cats = form.categories ?? [];
                    set('categories', e.target.checked ? [...cats, c.slug] : cats.filter(x => x !== c.slug));
                  }}
                />
                {c.name}
              </label>
            ))}
          </div>
        </Field>

        <CSVField label="Tags" field="tags" hint="Comma-separated, e.g. coding, writing, open-source" />

        <Field label="Platforms">
          <div className="admin-checkbox-grid">
            {PLATFORMS.map(p => (
              <label key={p} className="admin-check-label">
                <input
                  type="checkbox"
                  checked={(form.platforms ?? []).includes(p)}
                  onChange={e => {
                    const plats = form.platforms ?? [];
                    set('platforms', e.target.checked ? [...plats, p] : plats.filter(x => x !== p));
                  }}
                />
                {p}
              </label>
            ))}
          </div>
        </Field>
      </section>

      {/* ── Pricing & Availability ── */}
      <section className="admin-form-section">
        <h2>Pricing &amp; availability</h2>
        <div className="admin-form-grid">
          <Field label="Pricing type">
            <select className="admin-input admin-select" value={form.pricing_type ?? ''} onChange={e => set('pricing_type', e.target.value)}>
              {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Skill level">
            <select className="admin-input admin-select" value={form.skill_level ?? 'Beginner'} onChange={e => set('skill_level', e.target.value as 'Beginner' | 'Advanced')}>
              <option value="Beginner">Beginner</option>
              <option value="Advanced">Advanced</option>
            </select>
          </Field>
        </div>
        <div className="admin-form-row">
          <label className="admin-check-label"><input type="checkbox" checked={form.free_plan ?? false} onChange={e => set('free_plan', e.target.checked)} /> Free plan available</label>
          <label className="admin-check-label"><input type="checkbox" checked={form.open_source ?? false} onChange={e => set('open_source', e.target.checked)} /> Open source</label>
          <label className="admin-check-label"><input type="checkbox" checked={form.api_available ?? false} onChange={e => set('api_available', e.target.checked)} /> API available</label>
        </div>
      </section>

      {/* ── Detail fields ── */}
      <section className="admin-form-section">
        <h2>Details</h2>
        <CSVField label="Key features"    field="key_features"   hint="Comma-separated" />
        <CSVField label="Strengths"       field="strengths"      hint="Comma-separated" />
        <CSVField label="Limitations"     field="limitations"    hint="Comma-separated" />
        <CSVField label="Target users"    field="target_users"   hint="Comma-separated" />
        <CSVField label="Getting started" field="getting_started" hint="Comma-separated steps" />
        <CSVField label="Alternatives (slugs)" field="alternatives" hint="Comma-separated tool slugs" />
      </section>

      {/* ── Status & visibility ── */}
      <section className="admin-form-section">
        <h2>Status &amp; visibility</h2>
        <div className="admin-form-grid">
          <Field label="Status">
            <select className="admin-input admin-select" value={form.status ?? 'draft'} onChange={e => set('status', e.target.value as ToolRecord['status'])}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Verification status">
            <select className="admin-input admin-select" value={form.verification_status ?? 'unverified'} onChange={e => set('verification_status', e.target.value as ToolRecord['verification_status'])}>
              {VERIF_STATUSES.map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Featured order" hint="Lower = higher priority (0 = first)">
            <Input field="featured_order" type="number" min={0} />
          </Field>
        </div>
        <div className="admin-form-row">
          <label className="admin-check-label"><input type="checkbox" checked={form.is_featured ?? false} onChange={e => set('is_featured', e.target.checked)} /> Featured on homepage</label>
          <label className="admin-check-label"><input type="checkbox" checked={form.is_trending ?? false} onChange={e => set('is_trending', e.target.checked)} /> Mark as trending</label>
        </div>
      </section>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn primary" disabled={busy}>
          {busy ? 'Saving…' : (initialData ? 'Save changes' : 'Create tool')}
        </button>
      </div>
    </form>
  );
}
