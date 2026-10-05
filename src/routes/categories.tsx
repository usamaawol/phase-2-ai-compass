import { createFileRoute } from '@tanstack/react-router';
import { CategoryGrid } from '@/components/compass/shared';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/categories')({head:()=>pageHead('Explore AI Categories','Find AI tools across 26 categories, from coding and research to design and automation.'),component:Categories});
function Categories(){return <div className="shell pb-16"><div className="page-heading"><div className="eyebrow">26 WAYS TO FIND YOUR DIRECTION</div><h1>What do you want to do?</h1><p>From your first idea to your final edit. Explore AI by the work it helps you accomplish.</p></div><CategoryGrid/></div>}
