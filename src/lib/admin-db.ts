/**
 * Admin data layer — all Supabase operations for the admin panel.
 * Every function checks the caller is authenticated; role enforcement
 * is also enforced server-side via Supabase RLS + has_role().
 *
 * Public website reads from the static catalog (src/lib/catalog.ts) or
 * live Supabase reads for published tools. Admin writes go through here.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

/* ── Tool shape stored in catalog_tools.data ───────────────────── */
export interface ToolRecord {
  slug: string;
  name: string;
  company: string;
  tagline: string;
  short_description: string;
  long_description: string;
  official_url: string;
  official_pricing_url: string;
  official_docs_url: string;
  categories: string[];
  tags: string[];
  platforms: string[];
  pricing_type: string;
  free_plan: boolean | null;
  open_source: boolean;
  api_available: boolean | null;
  skill_level: 'Beginner' | 'Advanced';
  key_features: string[];
  strengths: string[];
  limitations: string[];
  target_users: string[];
  getting_started: string[];
  history: string;
  founded_year: number | null;
  launch_year: number | null;
  alternatives: string[];
  is_featured: boolean;
  featured_order: number;
  is_trending: boolean;
  verification_status: 'verified' | 'partially_verified' | 'needs_review' | 'unverified';
  last_verified_at: string | null;
  verified_by: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ToolStatus  = ToolRecord['status'];
export type VerifStatus = ToolRecord['verification_status'];

/* ── helpers ────────────────────────────────────────────────────── */
function now() { return new Date().toISOString(); }

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ── TOOLS ──────────────────────────────────────────────────────── */

/** List all tools (admin sees draft + archived too) */
export async function adminListTools() {
  const { data, error } = await supabase
    .from('catalog_tools')
    .select('slug, published, featured_order, data')
    .order('featured_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({
    ...(row.data as unknown as ToolRecord),
    slug: row.slug,
    published: row.published,
    featured_order: row.featured_order,
  }));
}

/** Get a single tool by slug */
export async function adminGetTool(slug: string) {
  const { data, error } = await supabase
    .from('catalog_tools')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return { ...(data.data as unknown as ToolRecord), slug: data.slug, published: data.published };
}

/** Create a new tool */
export async function adminCreateTool(tool: Partial<ToolRecord> & { name: string }) {
  const slug = tool.slug ?? slugify(tool.name);
  const record: ToolRecord = {
    slug,
    name: tool.name,
    company: tool.company ?? '',
    tagline: tool.tagline ?? '',
    short_description: tool.short_description ?? '',
    long_description: tool.long_description ?? '',
    official_url: tool.official_url ?? '',
    official_pricing_url: tool.official_pricing_url ?? '',
    official_docs_url: tool.official_docs_url ?? '',
    categories: tool.categories ?? [],
    tags: tool.tags ?? [],
    platforms: tool.platforms ?? [],
    pricing_type: tool.pricing_type ?? 'Check official website',
    free_plan: tool.free_plan ?? null,
    open_source: tool.open_source ?? false,
    api_available: tool.api_available ?? null,
    skill_level: tool.skill_level ?? 'Beginner',
    key_features: tool.key_features ?? [],
    strengths: tool.strengths ?? [],
    limitations: tool.limitations ?? [],
    target_users: tool.target_users ?? [],
    getting_started: tool.getting_started ?? [],
    history: tool.history ?? '',
    founded_year: tool.founded_year ?? null,
    launch_year: tool.launch_year ?? null,
    alternatives: tool.alternatives ?? [],
    is_featured: tool.is_featured ?? false,
    featured_order: tool.featured_order ?? 999,
    is_trending: tool.is_trending ?? false,
    verification_status: tool.verification_status ?? 'unverified',
    last_verified_at: null,
    verified_by: null,
    status: tool.status ?? 'draft',
    created_at: now(),
    updated_at: now(),
  };
  const { error } = await supabase.from('catalog_tools').insert({
    slug,
    published: record.status === 'published',
    featured_order: record.featured_order,
    data: record as unknown as Json,
  });
  if (error) throw error;
  return record;
}

/** Update an existing tool's data */
export async function adminUpdateTool(slug: string, updates: Partial<ToolRecord>) {
  const existing = await adminGetTool(slug);
  const merged: ToolRecord = { ...existing, ...updates, slug, updated_at: now() };
  const { error } = await supabase.from('catalog_tools').update({
    published: merged.status === 'published',
    featured_order: merged.featured_order,
    data: merged as unknown as Json,
  }).eq('slug', slug);
  if (error) throw error;
  return merged;
}

/** Soft-delete: archive the tool (never hard-delete by default) */
export async function adminArchiveTool(slug: string) {
  return adminUpdateTool(slug, { status: 'archived' });
}

/** Hard delete — only call when truly necessary */
export async function adminDeleteTool(slug: string) {
  const { error } = await supabase.from('catalog_tools').delete().eq('slug', slug);
  if (error) throw error;
}

/** Verify a tool — records admin uid + timestamp */
export async function adminVerifyTool(slug: string, adminUid: string, status: VerifStatus = 'verified') {
  return adminUpdateTool(slug, {
    verification_status: status,
    last_verified_at: now(),
    verified_by: adminUid,
  });
}

/** Un-verify a tool */
export async function adminUnverifyTool(slug: string) {
  return adminUpdateTool(slug, {
    verification_status: 'needs_review',
    last_verified_at: null,
    verified_by: null,
  });
}

/** Toggle featured */
export async function adminSetFeatured(slug: string, featured: boolean, order?: number) {
  return adminUpdateTool(slug, {
    is_featured: featured,
    featured_order: order ?? (featured ? 0 : 999),
  });
}

/** Toggle trending */
export async function adminSetTrending(slug: string, trending: boolean) {
  return adminUpdateTool(slug, { is_trending: trending });
}

/** Publish / unpublish */
export async function adminSetPublished(slug: string, published: boolean) {
  return adminUpdateTool(slug, { status: published ? 'published' : 'draft' });
}

/* ── CATEGORIES ─────────────────────────────────────────────────── */

export async function adminListCategories() {
  const { data, error } = await supabase
    .from('catalog_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertCategory(cat: {
  slug: string; name: string; description: string; featured?: boolean;
}) {
  const { error } = await supabase.from('catalog_categories').upsert({
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    featured: cat.featured ?? false,
  });
  if (error) throw error;
}

export async function adminDeleteCategory(slug: string) {
  const { error } = await supabase.from('catalog_categories').delete().eq('slug', slug);
  if (error) throw error;
}

/* ── TAGS ───────────────────────────────────────────────────────── */

export async function adminListTags() {
  const { data, error } = await supabase
    .from('catalog_tags')
    .select('name')
    .order('name');
  if (error) throw error;
  return (data ?? []).map(r => r.name);
}

export async function adminAddTag(name: string) {
  const { error } = await supabase.from('catalog_tags').insert({ name });
  if (error) throw error;
}

export async function adminDeleteTag(name: string) {
  const { error } = await supabase.from('catalog_tags').delete().eq('name', name);
  if (error) throw error;
}

/* ── SUBMISSIONS ────────────────────────────────────────────────── */

export async function adminListSubmissions(status?: string) {
  let query = supabase
    .from('tool_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function adminApproveSubmission(id: string, adminUid: string) {
  // 1. Get submission data
  const { data: sub, error: fetchErr } = await supabase
    .from('tool_submissions')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchErr) throw fetchErr;

  // 2. Create the tool from submission data
  await adminCreateTool({ ...(sub.data as unknown as Partial<ToolRecord>), status: 'published' });

  // 3. Mark submission approved
  const { error } = await supabase.from('tool_submissions').update({
    status: 'approved',
    review_note: `Approved by admin ${adminUid} at ${now()}`,
  }).eq('id', id);
  if (error) throw error;
}

export async function adminRejectSubmission(id: string, reason: string, adminUid: string) {
  const { error } = await supabase.from('tool_submissions').update({
    status: 'rejected',
    review_note: `Rejected by admin ${adminUid}: ${reason}`,
  }).eq('id', id);
  if (error) throw error;
}

/* ── SITE SETTINGS ──────────────────────────────────────────────── */

export async function adminGetSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data ?? { id: '', announcement: '', tagline: '', submissions_open: false };
}

export async function adminSaveSettings(settings: {
  announcement: string; tagline: string; submissions_open: boolean;
}) {
  // Upsert the single settings row
  const { error } = await supabase.from('site_settings').upsert({
    id: 'global',
    ...settings,
  });
  if (error) throw error;
}

/* ── DASHBOARD STATS ────────────────────────────────────────────── */

export async function adminGetStats() {
  const [toolsRes, catsRes, tagsRes, subsRes] = await Promise.all([
    supabase.from('catalog_tools').select('slug, published, data', { count: 'exact' }),
    supabase.from('catalog_categories').select('slug', { count: 'exact' }),
    supabase.from('catalog_tags').select('name', { count: 'exact' }),
    supabase.from('tool_submissions').select('id, status', { count: 'exact' }),
  ]);

  const tools    = toolsRes.data ?? [];
  const subs     = subsRes.data ?? [];
  const published = tools.filter(t => t.published).length;
  const drafts    = tools.filter(t => !t.published).length;
  const needsReview = tools.filter(t => {
    const d = t.data as unknown as ToolRecord;
    return d?.verification_status === 'needs_review' || d?.verification_status === 'unverified';
  }).length;
  const pendingSubs = subs.filter(s => s.status === 'pending').length;

  return {
    totalTools:   tools.length,
    published,
    drafts,
    needsReview,
    totalCats:    catsRes.count ?? 0,
    totalTags:    tagsRes.count ?? 0,
    totalSubs:    subs.length,
    pendingSubs,
  };
}

/* ── ROLE CHECK ─────────────────────────────────────────────────── */

/** Returns true if the given Firebase UID has the admin role in Supabase user_roles */
export async function isAdminUser(uid: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', uid)
    .eq('role', 'admin')
    .maybeSingle();
  if (error) return false;
  return !!data;
}
