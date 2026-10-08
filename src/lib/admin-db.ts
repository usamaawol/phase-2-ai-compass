/**
 * Admin data layer — all Firebase Firestore operations for the admin panel.
 * Security enforced server-side via Firebase Security Rules (firebase.rules).
 */
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
} from "@/lib/firebase";

/* ── Tool shape stored in Firestore: /tools/{slug} ───────────────── */
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
  skill_level: "Beginner" | "Advanced";
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
  verification_status: "verified" | "partially_verified" | "needs_review" | "unverified";
  last_verified_at: string | null;
  verified_by: string | null;
  verified_by_name: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export type ToolStatus = ToolRecord["status"];
export type VerifStatus = ToolRecord["verification_status"];

function now() {
  return new Date().toISOString();
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ── TOOLS ──────────────────────────────────────────────────────── */

export async function adminListTools() {
  const docs = await getDocs(query(collection(db, "tools"), orderBy("featured_order", "asc")));
  return docs.docs.map((d) => {
    const data = d.data() as unknown as ToolRecord;
    return {
      ...data,
      slug: d.id,
      published: data.status === "published",
    };
  });
}

export async function adminGetTool(slug: string) {
  const snap = await getDoc(doc(db, "tools", slug));
  if (!snap.exists()) throw new Error(`Tool not found: ${slug}`);
  const data = snap.data() as unknown as ToolRecord;
  return { ...data, slug: snap.id, published: data.status === "published" };
}

export async function adminCreateTool(
  tool: Partial<ToolRecord> & { name: string },
  adminUid?: string,
  adminName?: string,
) {
  const slug = tool.slug ?? slugify(tool.name);
  const record: ToolRecord = {
    slug,
    name: tool.name,
    company: tool.company ?? "",
    tagline: tool.tagline ?? "",
    short_description: tool.short_description ?? "",
    long_description: tool.long_description ?? "",
    official_url: tool.official_url ?? "",
    official_pricing_url: tool.official_pricing_url ?? "",
    official_docs_url: tool.official_docs_url ?? "",
    categories: tool.categories ?? [],
    tags: tool.tags ?? [],
    platforms: tool.platforms ?? [],
    pricing_type: tool.pricing_type ?? "Check official website",
    free_plan: tool.free_plan ?? null,
    open_source: tool.open_source ?? false,
    api_available: tool.api_available ?? null,
    skill_level: tool.skill_level ?? "Beginner",
    key_features: tool.key_features ?? [],
    strengths: tool.strengths ?? [],
    limitations: tool.limitations ?? [],
    target_users: tool.target_users ?? [],
    getting_started: tool.getting_started ?? [],
    history: tool.history ?? "",
    founded_year: tool.founded_year ?? null,
    launch_year: tool.launch_year ?? null,
    alternatives: tool.alternatives ?? [],
    is_featured: tool.is_featured ?? false,
    featured_order: tool.featured_order ?? 999,
    is_trending: tool.is_trending ?? false,
    verification_status: tool.verification_status ?? "unverified",
    last_verified_at: null,
    verified_by: null,
    verified_by_name: null,
    status: tool.status ?? "draft",
    created_at: now(),
    updated_at: now(),
    created_by: adminUid ?? null,
    updated_by: adminUid ?? null,
  };
  await setDoc(doc(db, "tools", slug), record as unknown as DocumentData);
  return record;
}

export async function adminUpdateTool(
  slug: string,
  updates: Partial<ToolRecord>,
  adminUid?: string,
) {
  const existing = await adminGetTool(slug);
  const merged: ToolRecord = {
    ...existing,
    ...updates,
    slug,
    updated_at: now(),
    updated_by: adminUid ?? existing.updated_by,
  };
  const writeData: Partial<ToolRecord> = { ...merged };
  delete (writeData as { slug?: string }).slug;
  await updateDoc(doc(db, "tools", slug), writeData as unknown as DocumentData);
  return merged;
}

export async function adminArchiveTool(slug: string, adminUid?: string) {
  return adminUpdateTool(slug, { status: "archived" }, adminUid);
}

export async function adminDeleteTool(slug: string) {
  await deleteDoc(doc(db, "tools", slug));
}

export async function adminVerifyTool(
  slug: string,
  adminUid: string,
  adminName: string,
  status: VerifStatus = "verified",
) {
  return adminUpdateTool(
    slug,
    {
      verification_status: status,
      last_verified_at: now(),
      verified_by: adminUid,
      verified_by_name: adminName,
    },
    adminUid,
  );
}

export async function adminUnverifyTool(slug: string, adminUid?: string) {
  return adminUpdateTool(
    slug,
    {
      verification_status: "needs_review",
      last_verified_at: null,
      verified_by: null,
      verified_by_name: null,
    },
    adminUid,
  );
}

export async function adminSetFeatured(
  slug: string,
  featured: boolean,
  order?: number,
  adminUid?: string,
) {
  return adminUpdateTool(
    slug,
    {
      is_featured: featured,
      featured_order: order ?? (featured ? 0 : 999),
    },
    adminUid,
  );
}

export async function adminSetTrending(slug: string, trending: boolean, adminUid?: string) {
  return adminUpdateTool(slug, { is_trending: trending }, adminUid);
}

export async function adminSetPublished(slug: string, published: boolean, adminUid?: string) {
  return adminUpdateTool(slug, { status: published ? "published" : "draft" }, adminUid);
}

/* ── CATEGORIES ─────────────────────────────────────────────────── */

export interface CategoryRecord {
  slug: string;
  name: string;
  description: string;
  featured: boolean;
}

export async function adminListCategories(): Promise<CategoryRecord[]> {
  const docs = await getDocs(query(collection(db, "categories"), orderBy("name")));
  return docs.docs.map((d) => ({
    slug: d.id,
    ...(d.data() as Omit<CategoryRecord, "slug">),
  }));
}

export async function adminUpsertCategory(cat: CategoryRecord) {
  const { slug, ...rest } = cat;
  await setDoc(doc(db, "categories", slug), { ...rest, featured: cat.featured ?? false });
}

export async function adminDeleteCategory(slug: string) {
  await deleteDoc(doc(db, "categories", slug));
}

/* ── TAGS ───────────────────────────────────────────────────────── */

export async function adminListTags(): Promise<string[]> {
  const docs = await getDocs(query(collection(db, "tags"), orderBy("name")));
  return docs.docs.map((d) => d.data().name as string);
}

export async function adminAddTag(name: string) {
  await setDoc(doc(db, "tags", name), { name });
}

export async function adminDeleteTag(name: string) {
  await deleteDoc(doc(db, "tags", name));
}

/* ── SUBMISSIONS ────────────────────────────────────────────────── */

export interface SubmissionRecord {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  review_note: string;
  created_at: string;
  data: Record<string, unknown>;
}

export async function adminListSubmissions(status?: string): Promise<SubmissionRecord[]> {
  const q = query(collection(db, "tool_submissions"), orderBy("created_at", "desc"));
  const docs = await getDocs(q);
  const all = docs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SubmissionRecord, "id">),
  }));
  if (!status || status === "all") return all;
  return all.filter((s) => s.status === status);
}

export async function adminApproveSubmission(id: string, adminUid: string, adminName: string) {
  const snap = await getDoc(doc(db, "tool_submissions", id));
  if (!snap.exists()) throw new Error("Submission not found");
  const sub = snap.data() as Omit<SubmissionRecord, "id">;
  await adminCreateTool(
    { ...(sub.data as unknown as Partial<ToolRecord>), status: "published" },
    adminUid,
    adminName,
  );
  await updateDoc(doc(db, "tool_submissions", id), {
    status: "approved",
    review_note: `Approved by ${adminName} (${adminUid}) at ${now()}`,
  });
}

export async function adminRejectSubmission(
  id: string,
  reason: string,
  adminUid: string,
  adminName: string,
) {
  await updateDoc(doc(db, "tool_submissions", id), {
    status: "rejected",
    review_note: `Rejected by ${adminName}: ${reason}`,
  });
}

/* ── FEEDBACK ───────────────────────────────────────────────────── */

export interface FeedbackRecord {
  id: string;
  user_id: string | null;
  user_email: string | null;
  type: "bug" | "suggestion" | "incorrect_info" | "other" | "suggest_tool";
  message: string;
  page_url: string;
  status: "new" | "reviewed" | "resolved" | "dismissed";
  admin_response: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export async function submitFeedback(feedback: {
  user_id?: string;
  user_email?: string;
  type: FeedbackRecord["type"];
  message: string;
  page_url: string;
}) {
  const docRef = await addDoc(collection(db, "feedback"), {
    user_id: feedback.user_id ?? null,
    user_email: feedback.user_email ?? null,
    type: feedback.type,
    message: feedback.message.trim(),
    page_url: feedback.page_url,
    status: "new",
    admin_response: null,
    created_at: now(),
    reviewed_at: null,
    reviewed_by: null,
  });
  return docRef.id;
}

export async function adminListFeedback(
  status?: string,
): Promise<(FeedbackRecord & { id: string })[]> {
  const q = query(collection(db, "feedback"), orderBy("created_at", "desc"));
  const docs = await getDocs(q);
  const all = docs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<FeedbackRecord, "id">),
  }));
  if (!status || status === "all") return all;
  return all.filter((f) => f.status === status);
}

export async function adminRespondFeedback(
  id: string,
  response: string,
  adminUid: string,
  adminName: string,
) {
  await updateDoc(doc(db, "feedback", id), {
    status: "reviewed",
    admin_response: response,
    reviewed_at: now(),
    reviewed_by: adminName,
    adminUid,
  });
}

export async function adminUpdateFeedbackStatus(
  id: string,
  status: FeedbackRecord["status"],
  adminUid: string,
  adminName: string,
) {
  await updateDoc(doc(db, "feedback", id), {
    status,
    reviewed_at: now(),
    reviewed_by: adminName,
  });
}

/* ── SITE SETTINGS ──────────────────────────────────────────────── */

export interface SiteSettings {
  id: string;
  announcement: string;
  tagline: string;
  submissions_open: boolean;
}

export async function adminGetSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, "site_settings", "global"));
  if (!snap.exists()) {
    return { id: "", announcement: "", tagline: "", submissions_open: false };
  }
  return { id: "global", ...(snap.data() as Omit<SiteSettings, "id">) };
}

export async function adminSaveSettings(settings: {
  announcement: string;
  tagline: string;
  submissions_open: boolean;
}) {
  await setDoc(doc(db, "site_settings", "global"), { ...settings });
}

export async function publicGetAnnouncement(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "global"));
    if (!snap.exists()) return null;
    return (snap.data()?.announcement as string) || null;
  } catch {
    return null;
  }
}

/* ── DASHBOARD STATS ────────────────────────────────────────────── */

export async function adminGetStats() {
  const [toolsDocs, catsDocs, tagsDocs, subsDocs, feedbackDocs] = await Promise.all([
    getDocs(collection(db, "tools")),
    getDocs(collection(db, "categories")),
    getDocs(collection(db, "tags")),
    getDocs(collection(db, "tool_submissions")),
    getDocs(collection(db, "feedback")),
  ]);

  const tools = toolsDocs.docs.map((d) => d.data() as unknown as ToolRecord);
  const subs = subsDocs.docs.map((d) => ({
    id: d.id,
    status: d.data().status as string,
  }));
  const feedback = feedbackDocs.docs.map((d) => ({
    id: d.id,
    status: d.data().status as string,
  }));

  const published = tools.filter((t) => t.status === "published").length;
  const drafts = tools.filter((t) => t.status === "draft").length;
  const needsReview = tools.filter(
    (t) => t.verification_status === "needs_review" || t.verification_status === "unverified",
  ).length;

  return {
    totalTools: tools.length,
    published,
    drafts,
    needsReview,
    totalCats: catsDocs.size,
    totalTags: tagsDocs.size,
    totalSubs: subs.length,
    pendingSubs: subs.filter((s) => s.status === "pending").length,
    totalFeedback: feedback.length,
    newFeedback: feedback.filter((s) => s.status === "new").length,
  };
}

/* ── ROLE CHECK ─────────────────────────────────────────────────── */

export async function isAdminUser(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "admin_users", uid));
    return snap.exists() && (snap.data()?.role as string) === "admin";
  } catch {
    return false;
  }
}

/* ── USER PROFILES ──────────────────────────────────────────────── */

export interface UserProfile {
  uid: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { uid, ...(snap.data() as Omit<UserProfile, "uid">) };
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile) {
  const { uid, ...rest } = profile;
  await setDoc(
    doc(db, "users", uid),
    {
      ...rest,
      updated_at: now(),
    },
    { merge: true },
  );
}

export async function getMySubmissions(uid: string): Promise<SubmissionRecord[]> {
  const docs = await getDocs(
    query(
      collection(db, "tool_submissions"),
      where("user_id", "==", uid),
      orderBy("created_at", "desc"),
    ),
  );
  return docs.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SubmissionRecord, "id">),
  }));
}

/* ── BOOKMARKS ──────────────────────────────────────────────────── */

export async function getBookmarks(uid: string): Promise<string[]> {
  try {
    const docs = await getDocs(collection(db, "users", uid, "bookmarks"));
    return docs.docs.map((d) => d.id);
  } catch {
    return [];
  }
}

export async function addBookmark(uid: string, toolId: string) {
  await setDoc(doc(db, "users", uid, "bookmarks", toolId), {
    toolId,
    createdAt: now(),
  });
}

export async function removeBookmark(uid: string, toolId: string) {
  await deleteDoc(doc(db, "users", uid, "bookmarks", toolId));
}

/* ── TOOL SUBMISSION (ADMIN-ONLY) ─────────────────────────────────
 * Regular users cannot submit AI tools directly. They must use Feedback
 * with the "suggest_tool" type. Admins manage tools and manual submissions
 * via the Admin Dashboard (/admin/tools/new) only.
 */

export async function submitTool(data: {
  user_id: string;
  name: string;
  official_url: string;
  company: string;
  short_description: string;
  categories: string[];
  submitter_notes: string;
}) {
  const isAdmin = await isAdminUser(data.user_id);
  if (!isAdmin) {
    throw new Error(
      "Access denied: Tool submissions are admin-only. Regular users should use Feedback → 'Suggest an AI Tool' instead.",
    );
  }
  const docRef = await addDoc(collection(db, "tool_submissions"), {
    user_id: data.user_id,
    status: "pending",
    review_note: "",
    created_at: now(),
    data: {
      name: data.name.trim(),
      official_url: data.official_url.trim(),
      company: data.company.trim(),
      short_description: data.short_description.trim(),
      categories: data.categories,
      submitter_notes: data.submitter_notes.trim(),
      submitted_at: now(),
    },
  });
  return docRef.id;
}
