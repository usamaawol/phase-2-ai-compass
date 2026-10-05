import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { getCategory } from '@/lib/catalog';
import { pageHead } from '@/lib/metadata';
import { discoverySearch } from '@/lib/search';
import { Discovery } from '@/components/compass/discovery';
export const Route=createFileRoute('/category/$slug')({validateSearch:discoverySearch,loader:({params})=>{const category=getCategory(params.slug);if(!category)throw notFound();return category.slug},head:({params})=>{const c=getCategory(params.slug);return pageHead(c?`${c.name} AI Tools`:'Category not found',c?.description??'Explore AI tool categories with AI Compass.')},component:CategoryPage});
function CategoryPage(){const {slug}=Route.useParams();const category=getCategory(slug);const filters=Route.useSearch();const navigate=Route.useNavigate();if(!category)return null;const Icon=category.icon;return <div className="shell"><div className="breadcrumb"><Link to="/categories">Categories</Link><ChevronRight/><span>{category.name}</span></div><div className="page-heading"><div className="eyebrow"><Icon size={18}/>EXPLORE YOUR POSSIBILITIES</div><h1>{category.name}</h1><p>{category.description}</p></div><Discovery filters={filters} lockedCategory={slug} onChange={next=>navigate({search:next,replace:true})}/></div>}
