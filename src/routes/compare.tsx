import { createFileRoute, Link } from '@tanstack/react-router';
import { GitCompareArrows, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/compare')({head:()=>pageHead('Compare AI Tools','Side-by-side AI tool comparison is coming to AI Compass. Explore individual tool profiles today.'),component:Compare});
function Compare(){return <div className="shell"><div className="page-heading"><div className="eyebrow">MAKE A MORE INFORMED CHOICE</div><h1>Compare AI tools</h1></div><div className="compare-placeholder"><GitCompareArrows strokeWidth={1.4}/><h2>A clearer comparison. Coming soon.</h2><p>Side-by-side comparisons are on the horizon. In the meantime, explore tool profiles to understand capabilities and find your best fit.</p><Button size="lg" asChild><Link to="/discover">Explore tool profiles<ArrowUpRight/></Link></Button></div></div>}
