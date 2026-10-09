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

function safeStr(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return fallback;
  try {
    const t = Object.prototype.toString.call(v);
    if (t === "[object String]" || t === "[object Number]" || t === "[object Boolean]") {
      return String(v);
    }
  } catch {}
  try {
    const s = Object.prototype.toString.call(v);
    return typeof s === "string" ? s : fallback;
  } catch {
    return fallback;
  }
}

function now() {
  return new Date().toISOString();
}

function slugify(name: string) {
  const n = safeStr(name, "");
  return n
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
  disabled?: boolean;
  ban_reason?: string;
  banned_at?: string;
  banned_by?: string;
  last_seen_at?: string;
  first_seen_at?: string;
  sign_in_count?: number;
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

/* ── ANALYTICS (page_views) ───────────────────────────────────── */

export interface PageViewRecord {
  id?: string;
  path: string;
  title?: string;
  user_id: string | null;
  user_email: string | null;
  session_id: string;
  referrer: string | null;
  user_agent: string | null;
  country_code: string | null;
  country_name: string | null;
  path_group: string;
  hour_bucket: string;
  day_bucket: string;
  week_bucket: string;
  month_bucket: string;
  created_at: string;
}

export async function trackPageView(
  data: Omit<
    PageViewRecord,
    | "hour_bucket"
    | "day_bucket"
    | "week_bucket"
    | "month_bucket"
    | "path_group"
    | "created_at"
    | "id"
  > & { title?: string },
) {
  try {
    const nowIso = now();
    let ts: Date;
    try {
      ts = new Date(nowIso);
    } catch {
      ts = new Date();
    }
    let year = 0;
    let month = "01";
    let day = "01";
    let hour = "00";
    let weekNum = "01";
    try {
      year = ts.getUTCFullYear();
      month = String(ts.getUTCMonth() + 1).padStart(2, "0");
      day = String(ts.getUTCDate()).padStart(2, "0");
      hour = String(ts.getUTCHours()).padStart(2, "0");
      weekNum = getUtcWeekNumber(ts);
    } catch {}

    const dataRec = data as unknown as Record<string, unknown>;
    const path = safeStr(dataRec?.["path"] ?? "/");
    const title = safeStr(dataRec?.["title"] ?? "");
    const uid = safeStr(dataRec?.["user_id"] ?? null);
    const email = safeStr(dataRec?.["user_email"] ?? null);
    const sid = safeStr(dataRec?.["session_id"] ?? "");
    const ref = safeStr(dataRec?.["referrer"] ?? null);
    const uagent = safeStr(dataRec?.["user_agent"] ?? null);
    const cc = safeStr(dataRec?.["country_code"] ?? null);
    const cn = safeStr(dataRec?.["country_name"] ?? null);

    try {
      await addDoc(collection(db, "page_views"), {
        path: path || "/",
        title: title || "",
        user_id: uid || null,
        user_email: email || null,
        session_id: sid || ("fallback-" + Math.random().toString(36).slice(2, 10)),
        referrer: ref,
        user_agent: uagent,
        country_code: cc,
        country_name: cn,
        path_group: pathToGroup(path || "/"),
        hour_bucket: `${year}-${month}-${day}_${hour}:00`,
        day_bucket: `${year}-${month}-${day}`,
        week_bucket: `${year}-W${weekNum}`,
        month_bucket: `${year}-${month}`,
        created_at: nowIso,
      });
    } catch {
      /* fire-and-forget, don't crash app if analytics fail */
    }
  } catch {
    /* top-level guard so even date/coercion failures never throw */
  }
}

function pathToGroup(path: string): string {
  try {
    const p = safeStr(path, "");
    if (p === "/") return "home";
    if (p.startsWith("/admin")) return "admin";
    if (p.startsWith("/tool")) return "tool_detail";
    if (p.startsWith("/category")) return "category_detail";
    if (p.startsWith("/categories")) return "categories";
    if (p.startsWith("/discover")) return "discover";
    if (p.startsWith("/find")) return "find";
    if (p.startsWith("/compare")) return "compare";
    if (p.startsWith("/saved")) return "saved";
    if (p.startsWith("/account")) return "account";
    if (p.startsWith("/submit")) return "suggest_tool";
    if (p.startsWith("/changelog")) return "changelog";
    if (p.startsWith("/faq")) return "faq";
    if (p.startsWith("/about")) return "about";
    return "other";
  } catch {
    return "other";
  }
}

function getUtcWeekNumber(d: Date): string {
  try {
    let target: Date;
    try {
      target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    } catch {
      target = new Date();
    }
    const dayNr = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
    const weekDiff = target.valueOf() - firstThursday.valueOf();
    const week =
      1 + Math.round((weekDiff / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
    return String(week).padStart(2, "0");
  } catch {
    return "01";
  }
}

/* ── ADMIN ANALYTICS QUERIES ────────────────────────────────── */

export async function getAnalytics(): Promise<{
  total_views: number;
  unique_sessions: number;
  unique_visitors: number;
  logged_in_users: number;
  total_views_last_7_days: { day: string; views: number; unique: number }[];
  top_pages: { path: string; views: number }[];
  user_signups_last_7: number;
}> {
  const today = new Date();
  const daysBack7 = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const q = query(collection(db, "page_views"), orderBy("created_at", "desc"), limit(2000));
  const docs = await getDocs(q);
  const all = docs.docs.map((d) => d.data() as PageViewRecord);

  const sessions = new Set<string>();
  const visitors = new Set<string>();
  const loggedUsers = new Set<string>();
  const pagesMap = new Map<string, number>();
  const dayMap = new Map<string, { views: number; unique: Set<string> }>();
  let signups = 0;

  for (const pv of all) {
    sessions.add(pv.session_id);
    const visitorKey = pv.user_id ?? `anon_${pv.session_id}`;
    visitors.add(visitorKey);
    if (pv.user_id) loggedUsers.add(pv.user_id);
    pagesMap.set(pv.path, (pagesMap.get(pv.path) ?? 0) + 1);

    const pvDate = new Date(pv.created_at);
    if (pvDate >= daysBack7 && pvDate <= today) {
      const dayKey = pv.day_bucket;
      if (!dayMap.has(dayKey)) dayMap.set(dayKey, { views: 0, unique: new Set() });
      const bucket = dayMap.get(dayKey)!;
      bucket.views += 1;
      bucket.unique.add(visitorKey);
    }
  }

  const userDocs = await getDocs(collection(db, "users"));
  for (const u of userDocs.docs) {
    const created = (u.data().created_at ?? u.data().first_seen_at) as string | undefined;
    if (created && new Date(created) >= daysBack7) signups++;
  }

  const daily = Array.from(dayMap.entries())
    .map(([day, data]) => ({ day, views: data.views, unique: data.unique.size }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const topPages = Array.from(pagesMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    total_views: all.length,
    unique_sessions: sessions.size,
    unique_visitors: visitors.size,
    logged_in_users: loggedUsers.size,
    total_views_last_7_days: daily,
    top_pages,
    user_signups_last_7: signups,
  };
}

/* ── ADMIN USERS MANAGEMENT (ban, list) ───────────────────────── */

export interface AdminUserItem {
  uid: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  disabled: boolean;
  ban_reason?: string;
  banned_at?: string;
  banned_by?: string;
  last_seen_at?: string;
  first_seen_at?: string;
  sign_in_count: number;
  created_at?: string;
  is_admin: boolean;
}

export async function adminListUsers(): Promise<AdminUserItem[]> {
  const [usersSnap, adminSnap] = await Promise.all([
    getDocs(query(collection(db, "users"), orderBy("created_at", "desc"), limit(500))),
    getDocs(collection(db, "admin_users")),
  ]);
  const adminUids = new Set(adminSnap.docs.map((d) => d.id));
  return usersSnap.docs.map((d) => {
    const ddata = d.data();
    return {
      uid: d.id,
      email: (ddata.email as string) ?? null,
      display_name: (ddata.display_name as string) ?? null,
      avatar_url: (ddata.avatar_url as string) ?? null,
      disabled: !!ddata.disabled,
      ban_reason: ddata.ban_reason as string | undefined,
      banned_at: ddata.banned_at as string | undefined,
      banned_by: ddata.banned_by as string | undefined,
      last_seen_at: ddata.last_seen_at as string | undefined,
      first_seen_at: ddata.first_seen_at as string | undefined,
      sign_in_count: (ddata.sign_in_count as number) ?? 0,
      created_at: ddata.created_at as string | undefined,
      is_admin: adminUids.has(d.id),
    };
  });
}

export async function adminBanUser(
  uid: string,
  reason: string,
  adminUid: string,
  adminName: string,
) {
  await updateDoc(doc(db, "users", uid), {
    disabled: true,
    ban_reason: reason.trim(),
    banned_at: now(),
    banned_by: adminName,
    banned_by_uid: adminUid,
    updated_at: now(),
  });
}

export async function adminUnbanUser(uid: string, adminUid: string, adminName: string) {
  await updateDoc(doc(db, "users", uid), {
    disabled: false,
    ban_reason: null,
    banned_at: null,
    banned_by: null,
    banned_by_uid: null,
    unbanned_at: now(),
    unbanned_by: adminName,
    unbanned_by_uid: adminUid,
    updated_at: now(),
  });
}

export async function recordUserActivity(
  uid: string,
  user: {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  },
) {
  const snap = await getDoc(doc(db, "users", uid));
  const existing = snap.exists() ? snap.data() : {};
  const signInCount = ((existing.sign_in_count as number) ?? 0) + 1;
  await setDoc(
    doc(db, "users", uid),
    {
      email: user.email,
      display_name: user.displayName,
      avatar_url: user.photoURL,
      last_seen_at: now(),
      first_seen_at: existing.first_seen_at ?? existing.created_at ?? now(),
      created_at: existing.created_at ?? now(),
      sign_in_count: signInCount,
      updated_at: now(),
    },
    { merge: true },
  );
}

export async function isUserBanned(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return false;
    return !!snap.data().disabled;
  } catch {
    return false;
  }
}
