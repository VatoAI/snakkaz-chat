-- SnakkaZ MCP Server Database Schema - Updated
-- Run this script in your Supabase SQL editor to add MCP-specific tables

-- ========================================================================
-- TECH COMPANIES TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS tech_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  region TEXT,
  industry TEXT[],
  founded_year INTEGER,
  size TEXT,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_hiring BOOLEAN DEFAULT FALSE
);

-- ========================================================================
-- TECH EVENTS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS tech_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  region TEXT,
  organizer TEXT,
  website TEXT,
  topics TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================================
-- TECH JOBS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS tech_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES tech_companies(id),
  description TEXT,
  location TEXT,
  region TEXT,
  skills_required TEXT[],
  experience_level TEXT,
  job_type TEXT,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_url TEXT,
  salary_range TEXT
);

-- ========================================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_tech_companies_region ON tech_companies(region);
CREATE INDEX IF NOT EXISTS idx_tech_companies_size ON tech_companies(size);
CREATE INDEX IF NOT EXISTS idx_tech_companies_is_hiring ON tech_companies(is_hiring);
CREATE INDEX IF NOT EXISTS idx_tech_events_region ON tech_events(region);
CREATE INDEX IF NOT EXISTS idx_tech_events_event_date ON tech_events(event_date);
CREATE INDEX IF NOT EXISTS idx_tech_jobs_region ON tech_jobs(region);
CREATE INDEX IF NOT EXISTS idx_tech_jobs_experience_level ON tech_jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_tech_jobs_posted_date ON tech_jobs(posted_date);

-- ========================================================================
-- SAMPLE DATA FOR TESTING
-- ========================================================================

-- Insert sample tech companies
INSERT INTO tech_companies (name, description, website, region, industry, founded_year, size, contact_info, is_hiring)
VALUES 
  ('Schibsted', 'Leading media and technology company in Norway', 'https://schibsted.com', 'oslo', ARRAY['Media', 'Technology'], 1839, 'Large', '{"email": "jobs@schibsted.com"}', true),
  ('Telenor', 'Major telecommunications company', 'https://telenor.com', 'oslo', ARRAY['Telecommunications', 'Technology'], 1855, 'Large', '{"email": "careers@telenor.com"}', true),
  ('Opera Software', 'Web browser and technology company', 'https://opera.com', 'oslo', ARRAY['Software', 'Browser Technology'], 1995, 'Medium', '{"email": "jobs@opera.com"}', true),
  ('Kahoot!', 'Learning platform and educational technology', 'https://kahoot.com', 'oslo', ARRAY['EdTech', 'Software'], 2012, 'Medium', '{"email": "jobs@kahoot.com"}', true),
  ('Equinor Digital', 'Digital solutions for energy sector', 'https://equinor.com', 'stavanger', ARRAY['Energy', 'Technology'], 1972, 'Large', '{"email": "careers@equinor.com"}', true),
  ('Variant', 'Consulting and software development', 'https://variant.no', 'trondheim', ARRAY['Consulting', 'Software'], 2018, 'Small', '{"email": "post@variant.no"}', true),
  ('Crayon', 'Global software asset management', 'https://crayon.com', 'oslo', ARRAY['Software', 'Cloud'], 2002, 'Large', '{"email": "careers@crayon.com"}', true),
  ('Otovo', 'Solar energy marketplace', 'https://otovo.com', 'oslo', ARRAY['Energy', 'Marketplace'], 2016, 'Medium', '{"email": "jobs@otovo.com"}', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample tech events
INSERT INTO tech_events (name, description, event_date, end_date, location, region, organizer, website, topics)
VALUES 
  ('NDC Security', 'Premier security conference in Scandinavia', '2025-08-15 09:00:00+00', '2025-08-17 18:00:00+00', 'Oslo Spektrum', 'oslo', 'NDC Conferences', 'https://ndcsecurity.com', ARRAY['Security', 'DevSecOps', 'Penetration Testing']),
  ('Booster Conference', 'Software conference focusing on people and technology', '2025-09-12 09:00:00+00', '2025-09-13 18:00:00+00', 'Bergen Børs', 'bergen', 'Booster', 'https://boosterconf.no', ARRAY['Software Development', 'Agile', 'Innovation']),
  ('JavaZone', 'Norway''s largest Java conference', '2025-09-10 09:00:00+00', '2025-09-11 18:00:00+00', 'Oslo Spektrum', 'oslo', 'JavaZone', 'https://javazone.no', ARRAY['Java', 'JVM', 'Microservices']),
  ('Oslo AI Meetup', 'Monthly AI and machine learning meetup', '2025-07-20 18:00:00+00', '2025-07-20 21:00:00+00', 'Rebel Oslo', 'oslo', 'Oslo AI Community', 'https://meetup.com/oslo-ai', ARRAY['AI', 'Machine Learning', 'Deep Learning']),
  ('Trondheim Developer Meetup', 'Local developer community meetup', '2025-07-25 18:00:00+00', '2025-07-25 21:00:00+00', 'NTNU Dragvoll', 'trondheim', 'Trondheim Developers', 'https://meetup.com/trondheim-dev', ARRAY['Web Development', 'Mobile', 'Cloud']),
  ('React Oslo', 'React and frontend development meetup', '2025-08-05 18:00:00+00', '2025-08-05 21:00:00+00', 'Mesh Community', 'oslo', 'React Oslo', 'https://meetup.com/react-oslo', ARRAY['React', 'Frontend', 'JavaScript'])
ON CONFLICT (name) DO NOTHING;

-- Insert sample tech jobs
INSERT INTO tech_jobs (title, company_id, description, location, region, skills_required, experience_level, job_type, posted_date, application_url, salary_range)
VALUES 
  ('Senior TypeScript Developer', (SELECT id FROM tech_companies WHERE name = 'Schibsted' LIMIT 1), 'Join our team building next-gen web applications', 'Oslo', 'oslo', ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL'], 'senior', 'full-time', '2025-07-01 10:00:00+00', 'https://schibsted.com/careers/senior-typescript-developer', '700-900k NOK'),
  ('AI Engineer', (SELECT id FROM tech_companies WHERE name = 'Telenor' LIMIT 1), 'Work on cutting-edge AI and machine learning projects', 'Oslo', 'oslo', ARRAY['Python', 'TensorFlow', 'PyTorch', 'Docker'], 'senior', 'full-time', '2025-07-02 10:00:00+00', 'https://telenor.com/careers/ai-engineer', '750-950k NOK'),
  ('Full-stack Developer', (SELECT id FROM tech_companies WHERE name = 'Opera Software' LIMIT 1), 'Great opportunity for developers to grow', 'Oslo', 'oslo', ARRAY['JavaScript', 'Vue.js', 'Express', 'MongoDB'], 'mid', 'full-time', '2025-07-03 10:00:00+00', 'https://opera.com/careers/fullstack-developer', '600-800k NOK'),
  ('DevOps Engineer', (SELECT id FROM tech_companies WHERE name = 'Equinor Digital' LIMIT 1), 'Infrastructure and automation for energy sector', 'Stavanger', 'stavanger', ARRAY['Kubernetes', 'AWS', 'Terraform', 'Python'], 'senior', 'full-time', '2025-07-04 10:00:00+00', 'https://equinor.com/careers/devops-engineer', '700-850k NOK'),
  ('Frontend Lead', (SELECT id FROM tech_companies WHERE name = 'Kahoot!' LIMIT 1), 'Lead frontend team in educational technology', 'Oslo', 'oslo', ARRAY['React', 'TypeScript', 'GraphQL', 'Webpack'], 'lead', 'full-time', '2025-07-05 10:00:00+00', 'https://kahoot.com/careers/frontend-lead', '850-1100k NOK'),
  ('Backend Developer', (SELECT id FROM tech_companies WHERE name = 'Variant' LIMIT 1), 'Build scalable backend systems', 'Trondheim', 'trondheim', ARRAY['Java', 'Spring', 'PostgreSQL', 'Redis'], 'mid', 'full-time', '2025-07-06 10:00:00+00', 'https://variant.no/careers/backend-developer', '600-750k NOK')
ON CONFLICT (title) DO NOTHING;

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

-- Public read access to tech companies, events, and jobs
CREATE POLICY "Public read access to tech companies" ON tech_companies
  FOR SELECT USING (true);

CREATE POLICY "Public read access to tech events" ON tech_events
  FOR SELECT USING (true);

CREATE POLICY "Public read access to tech jobs" ON tech_jobs
  FOR SELECT USING (true);

-- ========================================================================
-- COMPLETION MESSAGE
-- ========================================================================

-- Create a view to check if setup is complete
CREATE OR REPLACE VIEW mcp_setup_status AS
SELECT 
  'SnakkaZ MCP Server Database Setup Complete' as message,
  COUNT(*) as total_companies
FROM tech_companies;

-- Display setup completion
SELECT * FROM mcp_setup_status;
