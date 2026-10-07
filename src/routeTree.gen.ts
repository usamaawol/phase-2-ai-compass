/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// This file is manually maintained because Vite dev is not running in this environment.
// Re-run `vite dev` or `vite build` to auto-regenerate from TanStack Router plugin.

import { Route as rootRouteImport }             from './routes/__root'
import { Route as IndexRouteImport }             from './routes/index'
import { Route as AboutRouteImport }             from './routes/about'
import { Route as CategoriesRouteImport }        from './routes/categories'
import { Route as CompareRouteImport }           from './routes/compare'
import { Route as DiscoverRouteImport }          from './routes/discover'
import { Route as CategorySlugRouteImport }      from './routes/category.$slug'
import { Route as ToolSlugRouteImport }          from './routes/tool.$slug'
import { Route as AdminRouteImport }             from './routes/admin'
import { Route as AdminIndexRouteImport }        from './routes/admin/index'
import { Route as AdminToolsRouteImport }        from './routes/admin/tools/index'
import { Route as AdminToolsNewRouteImport }     from './routes/admin/tools/new'
import { Route as AdminToolsEditRouteImport }    from './routes/admin/tools/$slug.edit'
import { Route as AdminCategoriesRouteImport }   from './routes/admin/categories'
import { Route as AdminTagsRouteImport }         from './routes/admin/tags'
import { Route as AdminFeaturedRouteImport }     from './routes/admin/featured'
import { Route as AdminSubmissionsRouteImport }  from './routes/admin/submissions'
import { Route as AdminSettingsRouteImport }     from './routes/admin/settings'

/* ── Public routes ───────────────────────────────────────────── */
const IndexRoute = IndexRouteImport.update({
  id: '/', path: '/', getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about', path: '/about', getParentRoute: () => rootRouteImport,
} as any)
const CategoriesRoute = CategoriesRouteImport.update({
  id: '/categories', path: '/categories', getParentRoute: () => rootRouteImport,
} as any)
const CompareRoute = CompareRouteImport.update({
  id: '/compare', path: '/compare', getParentRoute: () => rootRouteImport,
} as any)
const DiscoverRoute = DiscoverRouteImport.update({
  id: '/discover', path: '/discover', getParentRoute: () => rootRouteImport,
} as any)
const CategorySlugRoute = CategorySlugRouteImport.update({
  id: '/category/$slug', path: '/category/$slug', getParentRoute: () => rootRouteImport,
} as any)
const ToolSlugRoute = ToolSlugRouteImport.update({
  id: '/tool/$slug', path: '/tool/$slug', getParentRoute: () => rootRouteImport,
} as any)

/* ── Admin layout + children ─────────────────────────────────── */
const AdminRoute = AdminRouteImport.update({
  id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport,
} as any)
const AdminIndexRoute = AdminIndexRouteImport.update({
  id: '/admin/', path: '/', getParentRoute: () => AdminRoute,
} as any)
const AdminToolsRoute = AdminToolsRouteImport.update({
  id: '/admin/tools', path: '/tools', getParentRoute: () => AdminRoute,
} as any)
const AdminToolsNewRoute = AdminToolsNewRouteImport.update({
  id: '/admin/tools/new', path: '/tools/new', getParentRoute: () => AdminRoute,
} as any)
const AdminToolsEditRoute = AdminToolsEditRouteImport.update({
  id: '/admin/tools/$slug/edit', path: '/tools/$slug/edit', getParentRoute: () => AdminRoute,
} as any)
const AdminCategoriesRoute = AdminCategoriesRouteImport.update({
  id: '/admin/categories', path: '/categories', getParentRoute: () => AdminRoute,
} as any)
const AdminTagsRoute = AdminTagsRouteImport.update({
  id: '/admin/tags', path: '/tags', getParentRoute: () => AdminRoute,
} as any)
const AdminFeaturedRoute = AdminFeaturedRouteImport.update({
  id: '/admin/featured', path: '/featured', getParentRoute: () => AdminRoute,
} as any)
const AdminSubmissionsRoute = AdminSubmissionsRouteImport.update({
  id: '/admin/submissions', path: '/submissions', getParentRoute: () => AdminRoute,
} as any)
const AdminSettingsRoute = AdminSettingsRouteImport.update({
  id: '/admin/settings', path: '/settings', getParentRoute: () => AdminRoute,
} as any)

/* ── Type declarations ───────────────────────────────────────── */
export interface FileRoutesByFullPath {
  '/':                    typeof IndexRoute
  '/about':               typeof AboutRoute
  '/categories':          typeof CategoriesRoute
  '/compare':             typeof CompareRoute
  '/discover':            typeof DiscoverRoute
  '/category/$slug':      typeof CategorySlugRoute
  '/tool/$slug':          typeof ToolSlugRoute
  '/admin':               typeof AdminRoute
  '/admin/':              typeof AdminIndexRoute
  '/admin/tools':         typeof AdminToolsRoute
  '/admin/tools/new':     typeof AdminToolsNewRoute
  '/admin/tools/$slug/edit': typeof AdminToolsEditRoute
  '/admin/categories':    typeof AdminCategoriesRoute
  '/admin/tags':          typeof AdminTagsRoute
  '/admin/featured':      typeof AdminFeaturedRoute
  '/admin/submissions':   typeof AdminSubmissionsRoute
  '/admin/settings':      typeof AdminSettingsRoute
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById {
  __root__:                typeof rootRouteImport
  '/':                     typeof IndexRoute
  '/about':                typeof AboutRoute
  '/categories':           typeof CategoriesRoute
  '/compare':              typeof CompareRoute
  '/discover':             typeof DiscoverRoute
  '/category/$slug':       typeof CategorySlugRoute
  '/tool/$slug':           typeof ToolSlugRoute
  '/admin':                typeof AdminRoute
  '/admin/':               typeof AdminIndexRoute
  '/admin/tools':          typeof AdminToolsRoute
  '/admin/tools/new':      typeof AdminToolsNewRoute
  '/admin/tools/$slug/edit': typeof AdminToolsEditRoute
  '/admin/categories':     typeof AdminCategoriesRoute
  '/admin/tags':           typeof AdminTagsRoute
  '/admin/featured':       typeof AdminFeaturedRoute
  '/admin/submissions':    typeof AdminSubmissionsRoute
  '/admin/settings':       typeof AdminSettingsRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/':                { id:'/'; path:'/'; fullPath:'/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/about':           { id:'/about'; path:'/about'; fullPath:'/about'; preLoaderRoute: typeof AboutRouteImport; parentRoute: typeof rootRouteImport }
    '/categories':      { id:'/categories'; path:'/categories'; fullPath:'/categories'; preLoaderRoute: typeof CategoriesRouteImport; parentRoute: typeof rootRouteImport }
    '/compare':         { id:'/compare'; path:'/compare'; fullPath:'/compare'; preLoaderRoute: typeof CompareRouteImport; parentRoute: typeof rootRouteImport }
    '/discover':        { id:'/discover'; path:'/discover'; fullPath:'/discover'; preLoaderRoute: typeof DiscoverRouteImport; parentRoute: typeof rootRouteImport }
    '/category/$slug':  { id:'/category/$slug'; path:'/category/$slug'; fullPath:'/category/$slug'; preLoaderRoute: typeof CategorySlugRouteImport; parentRoute: typeof rootRouteImport }
    '/tool/$slug':      { id:'/tool/$slug'; path:'/tool/$slug'; fullPath:'/tool/$slug'; preLoaderRoute: typeof ToolSlugRouteImport; parentRoute: typeof rootRouteImport }
    '/admin':           { id:'/admin'; path:'/admin'; fullPath:'/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
  }
}

/* ── Wire up children ────────────────────────────────────────── */
const AdminRouteChildren = {
  AdminIndexRoute,
  AdminToolsRoute,
  AdminToolsNewRoute,
  AdminToolsEditRoute,
  AdminCategoriesRoute,
  AdminTagsRoute,
  AdminFeaturedRoute,
  AdminSubmissionsRoute,
  AdminSettingsRoute,
}

AdminRoute._addFileChildren(AdminRouteChildren)

const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  CategoriesRoute,
  CompareRoute,
  DiscoverRoute,
  CategorySlugRoute,
  ToolSlugRoute,
  AdminRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRoutesByFullPath>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
