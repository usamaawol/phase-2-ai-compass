import { Bot, Code2, Globe, Smartphone, SquareTerminal, Terminal, Search, GraduationCap, PenLine, Zap, Image, WandSparkles, Video, Film, AudioLines, Music2, Palette, Presentation, BriefcaseBusiness, Megaphone, Workflow, Network, ChartNoAxesCombined, FileText, Braces, Monitor, type LucideIcon } from 'lucide-react';
export interface Category { name: string; slug: string; description: string; icon: LucideIcon; featured: boolean; tool_count: number }
const definitions: [string, string, string, LucideIcon][] = [
 ['AI Assistants','ai-assistants','A little help. A lot more possibility.',Bot],
 ['Coding','coding','Write, debug, and build better software.',Code2],
 ['Website Building','website-building','Turn your ideas into live websites.',Globe],
 ['Mobile App Building','mobile-app-building','Bring your next app idea to life.',Smartphone],
 ['AI Code Editors','ai-code-editors','Intelligence, right inside your editor.',SquareTerminal],
 ['AI CLI','ai-cli','Your terminal, with an extra pair of hands.',Terminal],
 ['Research','research','Go deeper. Find answers that matter.',Search],
 ['Education','education','Learn something new, your way.',GraduationCap],
 ['Writing','writing','Find the words you were looking for.',PenLine],
 ['Productivity','productivity','Less busywork. More meaningful work.',Zap],
 ['Image Generation','image-generation','Make the impossible picture possible.',Image],
 ['Image Editing','image-editing','Give every image a new perspective.',WandSparkles],
 ['Video Generation','video-generation','From an idea to a moving picture.',Video],
 ['Video Editing','video-editing','Make your next cut a little smarter.',Film],
 ['Voice & Audio','voice-audio','Give your ideas a voice.',AudioLines],
 ['Music','music','Explore a new world of sound.',Music2],
 ['Design','design','A new creative partner for your process.',Palette],
 ['Presentations','presentations','Make your next idea stand out.',Presentation],
 ['Business','business','Work smarter, from strategy to execution.',BriefcaseBusiness],
 ['Marketing','marketing','Connect your ideas with your audience.',Megaphone],
 ['Automation','automation','Put the repetitive work on autopilot.',Workflow],
 ['AI Agents','ai-agents','Explore tools that take the next step.',Network],
 ['Data Analysis','data-analysis','Turn your data into understanding.',ChartNoAxesCombined],
 ['PDF & Document Tools','pdf-document-tools','Get more out of every document.',FileText],
 ['AI APIs','ai-apis','Build intelligence into your product.',Braces],
 ['Local AI','local-ai','Run AI on your own machine.',Monitor],
];
export interface Tool { id: string; name: string; slug: string; logo: string; short_description: string; long_description: string; official_url: string; categories: string[]; tags: string[]; best_for: string[]; platforms: string[]; pricing_type: string; free_plan: boolean | null; open_source: boolean; api_available: boolean | null; skill_level: string; featured: boolean; verified: boolean; last_verified: string | null; created_at: string; updated_at: string; capabilities: string[]; demo: boolean; popularity: number }
const records: [string,string,string,string[],string[],string][] = [
 ['ChatGPT','chatgpt','A versatile AI assistant for writing, learning, and everyday problem-solving.',['ai-assistants','writing','education','data-analysis','productivity'],['AI assistant','Writing','Everyday tasks'],'https://chatgpt.com/'],
 ['Claude','claude','A thoughtful AI assistant for writing, coding, and working through complex ideas.',['ai-assistants','coding','research','writing','pdf-document-tools'],['Reasoning','Writing','Code'],'https://claude.ai/'],
 ['Lovable','lovable','Build websites and web applications by describing what you want to create.',['website-building','coding','design'],['App builder','Full stack','No-code'],'https://lovable.dev/'],
 ['Cursor','cursor','An AI-powered code editor that helps you write, understand, and improve code.',['ai-code-editors','coding','ai-agents'],['Code editor','Development','AI coding'],'https://cursor.com/'],
 ['Perplexity','perplexity','Explore questions and discover information with an AI-powered search experience.',['research','ai-assistants','education'],['Search','Research','Answers'],'https://www.perplexity.ai/'],
 ['Midjourney','midjourney','Explore visual ideas and create images from natural-language prompts.',['image-generation','design'],['Text to image','Creative','Art'],'https://www.midjourney.com/'],
 ['Runway','runway','AI-powered creative tools for generating and working with video.',['video-generation','video-editing','image-generation'],['Video','Creative','Generative AI'],'https://runwayml.com/'],
 ['ElevenLabs','elevenlabs','Create and work with AI-generated voices and audio.',['voice-audio','ai-apis'],['Voice','Text to speech','Audio'],'https://elevenlabs.io/'],
 ['Gamma','gamma','Create presentations and visual documents with AI assistance.',['presentations','design','business'],['Presentations','Documents','Visual storytelling'],'https://gamma.app/'],
 ['Suno','suno','Explore music creation with AI, from a prompt to a song.',['music','voice-audio'],['Music','Creative','Songs'],'https://suno.com/'],
 ['Notion AI','notion-ai','AI assistance for working with notes, documents, and team knowledge.',['productivity','writing','business','pdf-document-tools'],['Workspace','Notes','Team knowledge'],'https://www.notion.com/product/ai'],
 ['Replit','replit','Build and develop applications in a collaborative, AI-assisted environment.',['website-building','coding','mobile-app-building','ai-agents'],['App builder','Development','Cloud'],'https://replit.com/'],
 ['n8n','n8n','Connect applications and design workflows for repeatable tasks.',['automation','ai-agents','business'],['Workflows','Integrations','Automation'],'https://n8n.io/'],
 ['Ollama','ollama','Run and work with language models on your own machine.',['local-ai','ai-cli','ai-apis'],['Local models','Developer tools','CLI'],'https://ollama.com/'],
 ['Adobe Firefly','adobe-firefly','Explore generative AI tools for creating and editing visual content.',['image-generation','image-editing','design','marketing'],['Images','Creative','Editing'],'https://www.adobe.com/products/firefly.html'],
 ['Gemini','gemini','An AI assistant for exploring ideas, writing, and everyday questions.',['ai-assistants','education','research','productivity'],['AI assistant','Learning','Ideas'],'https://gemini.google.com/'],
];
// Pricing, platform, skill and popularity fields are illustrative demo metadata, not verified product claims.
export const tools: Tool[] = records.map(([name,slug,description,categories,tags,url],i) => ({ id:slug,name,slug,logo:slug,short_description:description,long_description:description+' Explore its official website to see current features, availability, and product documentation. Choose a tool based on your task and check its current terms before getting started.',official_url:url,categories,tags,best_for:tags,platforms:i===3||i===13?['Desktop']:['Web'],pricing_type:['Freemium','Freemium','Freemium','Paid','Free'][i%5]??'Unknown',free_plan:null,open_source:i===13,api_available:null,skill_level:i===3||i===12||i===13?'Advanced':'Beginner',featured:i<8,verified:false,last_verified:null,created_at:`2026-09-${String(i+1).padStart(2,'0')}T00:00:00Z`,updated_at:'2026-10-05T00:00:00Z',capabilities:tags,demo:true,popularity:100-i }));
export const categories: Category[] = definitions.map(([name,slug,description,icon],i)=>({name,slug,description,icon,featured:[0,1,2,6,10,12,14,20].includes(i),tool_count:tools.filter(t=>t.categories.includes(slug)).length}));
export const getCategory = (slug:string | undefined) => categories.find(c=>c.slug===slug);
export const getTool = (slug:string) => tools.find(t=>t.slug===slug);
export const taskPresets = [{label:'Build a website',category:'website-building'},{label:'Write code',category:'coding'},{label:'Create images',category:'image-generation'},{label:'Research a topic',category:'research'},{label:'Analyze a PDF',category:'pdf-document-tools'},{label:'Make a presentation',category:'presentations'},{label:'Edit a video',category:'video-editing'}];
export const emptyFilters = {q:'',category:'',tag:'',pricing:'',source:'',platform:'',skill:'',sort:'popular'};
export type Filters = typeof emptyFilters;
export function filterTools(items:Tool[],filters:Filters) {
 const q=filters.q.trim().toLowerCase();
 return items.filter(t=>(!q||[t.name,t.short_description,...t.tags,...t.categories.map(c=>getCategory(c)?.name??'')].join(' ').toLowerCase().includes(q))&&(!filters.category||t.categories.includes(filters.category))&&(!filters.tag||t.tags.includes(filters.tag))&&(!filters.pricing||t.pricing_type.toLowerCase()===filters.pricing.toLowerCase())&&(!filters.source||t.open_source)&&(!filters.platform||t.platforms.includes(filters.platform))&&(!filters.skill||t.skill_level===filters.skill)).sort((a,b)=>filters.sort==='az'?a.name.localeCompare(b.name):filters.sort==='newest'?b.created_at.localeCompare(a.created_at):b.popularity-a.popularity);
}
