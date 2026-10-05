<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## AI Compass architecture
- Keep tool/category records and filtering in a typed browser-safe catalog module; this phase uses bundled demo data without persistence.
- Use separate TanStack content routes with shared navigation and footer in the root; each page owns its metadata.
- Keep discovery filters in validated URL search parameters; category pages reuse the same filtering presentation.
- Treat demo product metadata as unverified and never turn illustrative pricing or popularity into factual claims.
- Define all visual roles in the global semantic design system and reuse the existing Button component for controls.
