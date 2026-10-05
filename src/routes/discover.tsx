import { createFileRoute } from '@tanstack/react-router';
import { Discovery } from '@/components/compass/discovery';
import { discoverySearch } from '@/lib/search';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/discover')({validateSearch:discoverySearch,head:()=>pageHead('Discover AI Tools','Explore AI tools by category, capability, and use case. Find your next tool with AI Compass.'),component:Discover});
function Discover(){const filters=Route.useSearch();const navigate=Route.useNavigate();return <div className="shell"><div className="page-heading"><div className="eyebrow">YOUR NEXT TOOL IS OUT THERE</div><h1>Discover AI Tools</h1><p>Explore AI tools by category, capability, and use case.</p></div><Discovery filters={filters} onChange={next=>navigate({search:next,replace:true})}/></div>}
