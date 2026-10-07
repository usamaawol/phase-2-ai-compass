import { describe, expect, it } from 'vitest';
import { tools, categories, filterTools, emptyFilters } from '@/lib/catalog';
describe('AI Compass catalog',()=>{
 it('contains all 26 categories and multiple categories per tool',()=>{expect(categories).toHaveLength(26);expect(tools.length).toBeGreaterThan(50);expect(tools.every(t=>t.categories.length>1)).toBe(true)});
 it('finds a tool by name and filters by category',()=>{expect(filterTools(tools,{...emptyFilters,q:'claude'}).map(t=>t.slug)).toContain('claude');expect(filterTools(tools,{...emptyFilters,category:'coding'}).every(t=>t.categories.includes('coding'))).toBe(true)});
 it('combines filters and returns an empty state',()=>{expect(filterTools(tools,{...emptyFilters,q:'no-such-tool'})).toHaveLength(0);expect(filterTools(tools,{...emptyFilters,source:'open',platform:'Desktop'}).map(t=>t.slug)).toEqual(['ollama'])});
 it('sorts alphabetically',()=>{const result=filterTools(tools,{...emptyFilters,sort:'az'});expect(result.map(t=>t.name)).toEqual(result.map(t=>t.name).sort((a,b)=>a.localeCompare(b)))});
 it('never claims verification for demo records and uses safe official URLs',()=>{expect(tools.every(t=>!t.verified&&t.demo&&t.last_verified===null&&t.official_url.startsWith('https://'))).toBe(true)});
});
