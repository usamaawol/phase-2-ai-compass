CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL, UNIQUE(user_id,role));
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_roles ON public.user_roles FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE FUNCTION public.has_role(_user_id uuid,_role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;
CREATE TABLE public.profiles (user_id uuid PRIMARY KEY, display_name text NOT NULL DEFAULT '', avatar_url text NOT NULL DEFAULT '', preferences jsonb NOT NULL DEFAULT '{}');
GRANT SELECT,INSERT,UPDATE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON public.profiles FOR ALL TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE TABLE public.catalog_tools (slug text PRIMARY KEY, data jsonb NOT NULL DEFAULT '{}', published boolean NOT NULL DEFAULT true, featured_order integer NOT NULL DEFAULT 0);
GRANT SELECT ON public.catalog_tools TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.catalog_tools TO authenticated; GRANT ALL ON public.catalog_tools TO service_role;
ALTER TABLE public.catalog_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_tools ON public.catalog_tools FOR SELECT TO anon,authenticated USING(published);
CREATE POLICY admin_tools ON public.catalog_tools FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.catalog_categories (slug text PRIMARY KEY, name text NOT NULL, description text NOT NULL DEFAULT '', featured boolean NOT NULL DEFAULT false);
GRANT SELECT ON public.catalog_categories TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.catalog_categories TO authenticated; GRANT ALL ON public.catalog_categories TO service_role;
ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_categories ON public.catalog_categories FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY admin_categories ON public.catalog_categories FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.catalog_tags (name text PRIMARY KEY);
GRANT SELECT ON public.catalog_tags TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.catalog_tags TO authenticated; GRANT ALL ON public.catalog_tags TO service_role;
ALTER TABLE public.catalog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_tags ON public.catalog_tags FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY admin_tags ON public.catalog_tags FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.tool_categories (tool_slug text REFERENCES public.catalog_tools(slug) ON DELETE CASCADE,category_slug text REFERENCES public.catalog_categories(slug) ON DELETE CASCADE,PRIMARY KEY(tool_slug,category_slug));
GRANT SELECT ON public.tool_categories TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.tool_categories TO authenticated; GRANT ALL ON public.tool_categories TO service_role;
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_tool_categories ON public.tool_categories FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.catalog_tools WHERE slug=tool_slug AND published));
CREATE POLICY admin_tool_categories ON public.tool_categories FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.tool_tags (tool_slug text REFERENCES public.catalog_tools(slug) ON DELETE CASCADE,tag_name text REFERENCES public.catalog_tags(name) ON DELETE CASCADE,PRIMARY KEY(tool_slug,tag_name));
GRANT SELECT ON public.tool_tags TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.tool_tags TO authenticated; GRANT ALL ON public.tool_tags TO service_role;
ALTER TABLE public.tool_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_tool_tags ON public.tool_tags FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.catalog_tools WHERE slug=tool_slug AND published));
CREATE POLICY admin_tool_tags ON public.tool_tags FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.tool_submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,data jsonb NOT NULL,status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','approved','rejected')),review_note text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE ON public.tool_submissions TO authenticated; GRANT ALL ON public.tool_submissions TO service_role;
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_submissions ON public.tool_submissions FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY submit_own ON public.tool_submissions FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND status='pending' AND review_note='');
CREATE POLICY admin_submissions ON public.tool_submissions FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE TABLE public.site_settings (id text PRIMARY KEY DEFAULT 'public',tagline text NOT NULL DEFAULT 'Find the Right AI for the Job.',announcement text NOT NULL DEFAULT '',submissions_open boolean NOT NULL DEFAULT true);
GRANT SELECT ON public.site_settings TO anon; GRANT SELECT,UPDATE ON public.site_settings TO authenticated; GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_settings ON public.site_settings FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY admin_settings ON public.site_settings FOR UPDATE TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
INSERT INTO public.site_settings(id) VALUES('public');
INSERT INTO public.catalog_categories(slug,name,description,featured) VALUES
('ai-assistants','AI Assistants','A little help. A lot more possibility.',true),('coding','Coding','Write, debug, and build better software.',true),('website-building','Website Building','Turn your ideas into live websites.',true),('mobile-app-building','Mobile App Building','Bring your next app idea to life.',false),('ai-code-editors','AI Code Editors','Intelligence, right inside your editor.',false),('ai-cli','AI CLI','Your terminal, with an extra pair of hands.',false),('research','Research','Go deeper. Find answers that matter.',true),('education','Education','Learn something new, your way.',false),('writing','Writing','Find the words you were looking for.',false),('productivity','Productivity','Less busywork. More meaningful work.',false),('image-generation','Image Generation','Make the impossible picture possible.',true),('image-editing','Image Editing','Give every image a new perspective.',false),('video-generation','Video Generation','From an idea to a moving picture.',true),('video-editing','Video Editing','Make your next cut a little smarter.',false),('voice-audio','Voice & Audio','Give your ideas a voice.',true),('music','Music','Explore a new world of sound.',false),('design','Design','A new creative partner for your process.',false),('presentations','Presentations','Make your next idea stand out.',false),('business','Business','Work smarter, from strategy to execution.',false),('marketing','Marketing','Connect your ideas with your audience.',false),('automation','Automation','Put the repetitive work on autopilot.',true),('ai-agents','AI Agents','Explore tools that take the next step.',false),('data-analysis','Data Analysis','Turn your data into understanding.',false),('pdf-document-tools','PDF & Document Tools','Get more out of every document.',false),('ai-apis','AI APIs','Build intelligence into your product.',false),('local-ai','Local AI','Run AI on your own machine.',false);
INSERT INTO public.catalog_tools(slug,data,featured_order) VALUES
('chatgpt','{"name":"ChatGPT","short_description":"A versatile AI assistant for writing, learning, and everyday problem-solving.","official_url":"https://chatgpt.com/","categories":["ai-assistants","writing","education","data-analysis","productivity"],"tags":["AI assistant","Writing","Everyday tasks"],"demo":true,"featured":true}',1),
('claude','{"name":"Claude","short_description":"A thoughtful AI assistant for writing, coding, and working through complex ideas.","official_url":"https://claude.ai/","categories":["ai-assistants","coding","research","writing","pdf-document-tools"],"tags":["Reasoning","Writing","Code"],"demo":true,"featured":true}',2),
('lovable','{"name":"Lovable","short_description":"Build websites and web applications by describing what you want to create.","official_url":"https://lovable.dev/","categories":["website-building","coding","design"],"tags":["App builder","Full stack","No-code"],"demo":true,"featured":true}',3),
('cursor','{"name":"Cursor","short_description":"An AI-powered code editor that helps you write, understand, and improve code.","official_url":"https://cursor.com/","categories":["ai-code-editors","coding","ai-agents"],"tags":["Code editor","Development","AI coding"],"demo":true,"featured":true}',4),
('perplexity','{"name":"Perplexity","short_description":"Explore questions with an AI-powered search experience.","official_url":"https://www.perplexity.ai/","categories":["research","ai-assistants","education"],"tags":["Search","Research","Answers"],"demo":true,"featured":true}',5),
('midjourney','{"name":"Midjourney","short_description":"Explore visual ideas and create images from natural-language prompts.","official_url":"https://www.midjourney.com/","categories":["image-generation","design"],"tags":["Text to image","Creative","Art"],"demo":true,"featured":true}',6),
('runway','{"name":"Runway","short_description":"AI-powered creative tools for generating and working with video.","official_url":"https://runwayml.com/","categories":["video-generation","video-editing","image-generation"],"tags":["Video","Creative","Generative AI"],"demo":true,"featured":true}',7),
('elevenlabs','{"name":"ElevenLabs","short_description":"Create and work with AI-generated voices and audio.","official_url":"https://elevenlabs.io/","categories":["voice-audio","ai-apis"],"tags":["Voice","Text to speech","Audio"],"demo":true,"featured":true}',8),
('gamma','{"name":"Gamma","short_description":"Create presentations and visual documents with AI assistance.","official_url":"https://gamma.app/","categories":["presentations","design","business"],"tags":["Presentations","Documents","Visual storytelling"],"demo":true}',9),
('suno','{"name":"Suno","short_description":"Explore music creation with AI, from a prompt to a song.","official_url":"https://suno.com/","categories":["music","voice-audio"],"tags":["Music","Creative","Songs"],"demo":true}',10),
('notion-ai','{"name":"Notion AI","short_description":"AI assistance for notes, documents, and team knowledge.","official_url":"https://www.notion.com/product/ai","categories":["productivity","writing","business","pdf-document-tools"],"tags":["Workspace","Notes","Team knowledge"],"demo":true}',11),
('replit','{"name":"Replit","short_description":"Build applications in a collaborative, AI-assisted environment.","official_url":"https://replit.com/","categories":["website-building","coding","mobile-app-building","ai-agents"],"tags":["App builder","Development","Cloud"],"demo":true}',12),
('n8n','{"name":"n8n","short_description":"Connect applications and design workflows for repeatable tasks.","official_url":"https://n8n.io/","categories":["automation","ai-agents","business"],"tags":["Workflows","Integrations","Automation"],"demo":true}',13),
('ollama','{"name":"Ollama","short_description":"Run and work with language models on your own machine.","official_url":"https://ollama.com/","categories":["local-ai","ai-cli","ai-apis"],"tags":["Local models","Developer tools","CLI"],"demo":true}',14),
('adobe-firefly','{"name":"Adobe Firefly","short_description":"Explore generative AI tools for creating and editing visual content.","official_url":"https://www.adobe.com/products/firefly.html","categories":["image-generation","image-editing","design","marketing"],"tags":["Images","Creative","Editing"],"demo":true}',15),
('gemini','{"name":"Gemini","short_description":"An AI assistant for exploring ideas, writing, and everyday questions.","official_url":"https://gemini.google.com/","categories":["ai-assistants","education","research","productivity"],"tags":["AI assistant","Learning","Ideas"],"demo":true}',16);
INSERT INTO public.catalog_tags(name) SELECT DISTINCT jsonb_array_elements_text(data->'tags') FROM public.catalog_tools;
INSERT INTO public.tool_categories(tool_slug,category_slug) SELECT slug,jsonb_array_elements_text(data->'categories') FROM public.catalog_tools;
INSERT INTO public.tool_tags(tool_slug,tag_name) SELECT slug,jsonb_array_elements_text(data->'tags') FROM public.catalog_tools;
CREATE FUNCTION public.admin_catalog_action(payload jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE action text:=payload->>'action'; item jsonb:=payload->'item'; tool_slug text; submission public.tool_submissions;
BEGIN
IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Administrator access required'; END IF;
IF action='save_tool' OR action='approve' THEN
IF action='approve' THEN SELECT * INTO submission FROM public.tool_submissions WHERE id=(payload->>'id')::uuid FOR UPDATE; IF submission.id IS NULL OR submission.status<>'pending' THEN RAISE EXCEPTION 'Submission is not pending'; END IF; item:=submission.data; END IF;
tool_slug:=item->>'slug';
IF action='approve' AND EXISTS(SELECT 1 FROM public.catalog_tools WHERE slug=tool_slug) THEN RAISE EXCEPTION 'Tool already exists; edit the existing tool instead'; END IF;
item:=item || jsonb_build_object('updated_at',now());
INSERT INTO public.catalog_tools(slug,data,published) VALUES(tool_slug,item,COALESCE((payload->>'published')::boolean,true)) ON CONFLICT(slug) DO UPDATE SET data=EXCLUDED.data,published=EXCLUDED.published;
DELETE FROM public.tool_categories WHERE tool_categories.tool_slug=admin_catalog_action.tool_slug;
DELETE FROM public.tool_tags WHERE tool_tags.tool_slug=admin_catalog_action.tool_slug;
INSERT INTO public.tool_categories SELECT tool_slug,jsonb_array_elements_text(COALESCE(item->'categories','[]'));
INSERT INTO public.catalog_tags SELECT jsonb_array_elements_text(COALESCE(item->'tags','[]')) ON CONFLICT DO NOTHING;
INSERT INTO public.tool_tags SELECT tool_slug,jsonb_array_elements_text(COALESCE(item->'tags','[]'));
IF action='approve' THEN UPDATE public.tool_submissions SET status='approved',review_note='Approved for the catalog' WHERE id=submission.id; END IF;
ELSIF action='delete_tool' THEN DELETE FROM public.catalog_tools WHERE slug=payload->>'id';
ELSIF action='verify' THEN UPDATE public.catalog_tools SET data=data||jsonb_build_object('verified',true,'last_verified',now(),'demo',false,'updated_at',now()) WHERE slug=payload->>'id';
ELSIF action='reject' THEN UPDATE public.tool_submissions SET status='rejected',review_note=payload->>'note' WHERE id=(payload->>'id')::uuid AND status='pending';
ELSIF action='save_category' THEN INSERT INTO public.catalog_categories(slug,name,description,featured) VALUES(item->>'slug',item->>'name',COALESCE(item->>'description',''),COALESCE((item->>'featured')::boolean,false)) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,featured=EXCLUDED.featured;
ELSIF action='delete_category' THEN DELETE FROM public.catalog_categories WHERE slug=payload->>'id';
ELSIF action='save_tag' THEN INSERT INTO public.catalog_tags(name) VALUES(item->>'name') ON CONFLICT DO NOTHING;
ELSIF action='delete_tag' THEN DELETE FROM public.catalog_tags WHERE name=payload->>'id';
ELSIF action='feature' THEN UPDATE public.catalog_tools SET data=data||jsonb_build_object('featured',(payload->>'featured')::boolean),featured_order=COALESCE((payload->>'order')::integer,0) WHERE slug=payload->>'id';
ELSIF action='settings' THEN UPDATE public.site_settings SET tagline=item->>'tagline',announcement=item->>'announcement',submissions_open=(item->>'submissions_open')::boolean WHERE id='public';
ELSE RAISE EXCEPTION 'Unknown action'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.admin_catalog_action(jsonb) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.admin_catalog_action(jsonb) TO authenticated;
