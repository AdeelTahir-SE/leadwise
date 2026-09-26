-- ============================================================
-- Seed: Development data matching src/lib/mockData.ts
-- Run AFTER all migrations.
-- Creates a demo workspace, demo user placeholder, ICP config,
-- leads, lead_events, and outreach_drafts that exactly match
-- the mock data Member 1's frontend was developed against.
-- ============================================================

-- NOTE: Replace the UUIDs below with real Supabase auth.users IDs
-- when seeding a real environment. These are stable dev-only IDs.

DO $$
DECLARE
  v_workspace_id  UUID := '00000000-0000-0000-0000-000000000001';
  v_owner_id      UUID := '00000000-0000-0000-0000-000000000099'; -- placeholder auth user
  v_icp_id        UUID := '00000000-0000-0000-0000-000000000010';
  v_run_id        UUID := '00000000-0000-0000-0000-000000000020';
  v_lead_001      UUID := '00000000-0000-0000-0001-000000000001';
  v_lead_002      UUID := '00000000-0000-0000-0001-000000000002';
  v_lead_003      UUID := '00000000-0000-0000-0001-000000000003';
  v_lead_004      UUID := '00000000-0000-0000-0001-000000000004';
  v_lead_005      UUID := '00000000-0000-0000-0001-000000000005';
BEGIN

-- Workspace
INSERT INTO public.workspaces (id, name, owner_id)
VALUES (v_workspace_id, 'Demo Workspace', v_owner_id)
ON CONFLICT (id) DO NOTHING;

-- Workspace member
INSERT INTO public.workspace_members (workspace_id, user_id, role)
VALUES (v_workspace_id, v_owner_id, 'owner')
ON CONFLICT DO NOTHING;

-- ICP Config (mirrors initialIcpConfig in mockData.ts)
INSERT INTO public.icp_configs (
  id, workspace_id,
  target_industries, min_employees, max_employees,
  target_locations, required_tech_stack, preferred_tech_stack,
  negative_keywords, min_qualification_score, auto_enrich_threshold,
  auto_draft_outreach, score_threshold, max_tokens_per_run, max_api_calls_per_run
) VALUES (
  v_icp_id, v_workspace_id,
  ARRAY['B2B SaaS','FinTech','HealthTech','Cybersecurity','Cloud Infrastructure'],
  50, 500,
  ARRAY['United States','Canada','United Kingdom','Western Europe'],
  ARRAY['AWS','Salesforce','React'],
  ARRAY['PostgreSQL','HubSpot','Docker','Snowflake'],
  ARRAY['Staffing Agency','Cryptocurrency Trading','Student Project'],
  75, 80, TRUE, 50, 50000, 30
) ON CONFLICT DO NOTHING;

-- Agent run (dummy, represents the seeded data run)
INSERT INTO public.agent_runs (id, workspace_id, icp_config_id, status, pipeline_stage)
VALUES (v_run_id, v_workspace_id, v_icp_id, 'completed', 'drafted')
ON CONFLICT (id) DO NOTHING;

-- ── lead_001: Summit Digital Health ──────────────────────────
INSERT INTO public.leads (
  id, workspace_id, run_id, icp_config_id,
  company_name, domain, website, industry, employee_count, location,
  contact_name, contact_title, contact_email, contact_linkedin,
  stage, score, confidence,
  score_breakdown, technologies, intent_signals
) VALUES (
  v_lead_001, v_workspace_id, v_run_id, v_icp_id,
  'Summit Digital Health', 'summitdigital.io', 'https://summitdigital.io',
  'HealthTech & SaaS', 140, 'Boston, MA, USA',
  'Marcus Vance', 'VP of Sales & Revenue Operations',
  'marcus.v@summitdigital.io', 'https://linkedin.com/in/marcus-vance-sales',
  'outreach_ready', 96, 94,
  '{"industryMatch":98,"companySize":95,"techStack":94,"intentSignals":97,"overallScore":96}',
  ARRAY['AWS','Salesforce','React','Docker','HubSpot'],
  ARRAY[
    'Hiring 4 Outbound Account Executives (posted 3d ago)',
    'Announced $14M Series A Funding (TechCrunch)',
    'Recently migrated CRM to Salesforce Enterprise'
  ]
) ON CONFLICT DO NOTHING;

INSERT INTO public.lead_events
  (lead_id, run_id, step, agent_name, reasoning, confidence, citations)
VALUES
  (v_lead_001, v_run_id, 'research', 'Research Agent (Tavily/Playwright)',
   'Located domain summitdigital.io. Crawled /careers and /about. Detected B2B HIPAA-compliant workflow engine.',
   95, ARRAY['https://summitdigital.io/about','https://techcrunch.com/2026/summit-funding']),
  (v_lead_001, v_run_id, 'qualification', 'Qualification Agent (JSON Schema)',
   'Matches ICP: Verticals HealthTech + B2B SaaS. Employee headcount 140 fits [50-500] band. Located in Boston, MA.',
   98, ARRAY['LinkedIn company insights']),
  (v_lead_001, v_run_id, 'enrichment', 'Enrichment Agent (Hunter/Clearbit)',
   'Found VP of Sales Marcus Vance with verified MX deliverability score 99%. Validated SMTP handshakes.',
   96, ARRAY['hunter.io/verify','mx1.summitdigital.io']),
  (v_lead_001, v_run_id, 'scoring', 'Scoring Agent (Hybrid LLM)',
   'High buying intent confirmed by 4 active sales hires and recent capital injection. Total score evaluated to 96/100.',
   94, ARRAY[]::TEXT[]);

-- ── lead_002: CloudScale Analytics ───────────────────────────
INSERT INTO public.leads (
  id, workspace_id, run_id, icp_config_id,
  company_name, domain, website, industry, employee_count, location,
  contact_name, contact_title, contact_email, contact_linkedin,
  stage, score, confidence, score_breakdown, technologies, intent_signals
) VALUES (
  v_lead_002, v_workspace_id, v_run_id, v_icp_id,
  'CloudScale Analytics', 'cloudscale.ai', 'https://cloudscale.ai',
  'Cloud Infrastructure', 220, 'San Francisco, CA, USA',
  'Elena Rostova', 'Head of Growth & Demand Gen',
  'elena@cloudscale.ai', 'https://linkedin.com/in/elena-rostova',
  'outreach_ready', 92, 91,
  '{"industryMatch":94,"companySize":92,"techStack":96,"intentSignals":86,"overallScore":92}',
  ARRAY['AWS','React','PostgreSQL','Snowflake','Kubernetes'],
  ARRAY['Visited Pricing page 3 times in last 48 hours','Expanding SDR team by 35% in Q3']
) ON CONFLICT DO NOTHING;

INSERT INTO public.lead_events
  (lead_id, run_id, step, agent_name, reasoning, confidence, citations)
VALUES
  (v_lead_002, v_run_id, 'research', 'Research Agent',
   'Discovered CloudScale through G2 category scraping. Identified SaaS data warehousing tool.',
   92, ARRAY['https://cloudscale.ai']),
  (v_lead_002, v_run_id, 'qualification', 'Qualification Agent',
   'Verified 220 employees on LinkedIn. Headquartered in SF. AWS and Snowflake confirmed.',
   94, ARRAY[]::TEXT[]),
  (v_lead_002, v_run_id, 'enrichment', 'Enrichment Agent',
   'Enriched decision maker Elena Rostova. Verified direct business email.',
   90, ARRAY[]::TEXT[]);

-- ── lead_003: FinPulse Labs ───────────────────────────────────
INSERT INTO public.leads (
  id, workspace_id, run_id, icp_config_id,
  company_name, domain, website, industry, employee_count, location,
  contact_name, contact_title, contact_email,
  stage, score, confidence, score_breakdown, technologies, intent_signals
) VALUES (
  v_lead_003, v_workspace_id, v_run_id, v_icp_id,
  'FinPulse Labs', 'finpulse.co', 'https://finpulse.co',
  'FinTech', 85, 'Toronto, Canada',
  'David Sterling', 'Chief Revenue Officer', 'd.sterling@finpulse.co',
  'enriched', 88, 89,
  '{"industryMatch":90,"companySize":88,"techStack":85,"intentSignals":89,"overallScore":88}',
  ARRAY['AWS','Salesforce','Node.js','Stripe'],
  ARRAY['New Series B announcement','Hiring Product Marketing Lead']
) ON CONFLICT DO NOTHING;

INSERT INTO public.lead_events
  (lead_id, run_id, step, agent_name, reasoning, confidence, citations)
VALUES
  (v_lead_003, v_run_id, 'research', 'Research Agent',
   'Discovered through Crunchbase Series B feed.', 90, ARRAY[]::TEXT[]);

-- ── lead_004: CyberShield Security ───────────────────────────
INSERT INTO public.leads (
  id, workspace_id, run_id, icp_config_id,
  company_name, domain, website, industry, employee_count, location,
  contact_name, contact_title, contact_email,
  stage, score, confidence, score_breakdown, technologies, intent_signals
) VALUES (
  v_lead_004, v_workspace_id, v_run_id, v_icp_id,
  'CyberShield Security', 'cybershield.net', 'https://cybershield.net',
  'Cybersecurity', 310, 'Austin, TX, USA',
  'Rachel Kim', 'Director of Inbound & Outbound Sales', 'rkim@cybershield.net',
  'qualified', 84, 86,
  '{"industryMatch":88,"companySize":85,"techStack":82,"intentSignals":81,"overallScore":84}',
  ARRAY['AWS','React','HubSpot'],
  ARRAY['Expanding US sales territory']
) ON CONFLICT DO NOTHING;

INSERT INTO public.lead_events
  (lead_id, run_id, step, agent_name, reasoning, confidence, citations)
VALUES
  (v_lead_004, v_run_id, 'research', 'Research Agent',
   'Crawled security vendor index. Verified active commercial product.', 88, ARRAY[]::TEXT[]);

-- ── lead_005: RetailBoost AI (disqualified) ───────────────────
INSERT INTO public.leads (
  id, workspace_id, run_id, icp_config_id,
  company_name, domain, website, industry, employee_count, location,
  contact_name, contact_title, contact_email,
  stage, score, confidence, score_breakdown, technologies, intent_signals
) VALUES (
  v_lead_005, v_workspace_id, v_run_id, v_icp_id,
  'RetailBoost AI', 'retailboost.org', 'https://retailboost.org',
  'E-Commerce Tech', 18, 'Miami, FL, USA',
  'Alex Rivera', 'Founder & CEO', 'alex@retailboost.org',
  'disqualified', 42, 95,
  '{"industryMatch":60,"companySize":20,"techStack":50,"intentSignals":38,"overallScore":42}',
  ARRAY['Shopify','WordPress'],
  ARRAY['No recent hiring activity']
) ON CONFLICT DO NOTHING;

INSERT INTO public.lead_events
  (lead_id, run_id, step, agent_name, reasoning, confidence, citations)
VALUES
  (v_lead_005, v_run_id, 'qualification', 'Qualification Agent',
   'Disqualified: Headcount is 18 (below minimum required threshold of 50). Missing required tech stack (AWS/Salesforce).',
   96, ARRAY['https://linkedin.com/company/retailboost']);

-- ── outreach_drafts ───────────────────────────────────────────
INSERT INTO public.outreach_drafts (
  id, lead_id, workspace_id, channel, subject, body,
  personalized_hook, signals_cited, status
) VALUES (
  '00000000-0000-0000-0002-000000000001',
  v_lead_001, v_workspace_id, 'email',
  'Scaling outbound for Summit Digital''s 4 new AEs?',
  E'Hi Marcus,\n\nSaw that Summit Digital recently closed your $14M Series A and you''re actively scaling out 4 new Account Executive roles in Boston — huge congrats on the momentum!\n\nAs your new reps ramp up, keeping their calendars filled with qualified healthcare SaaS buyers is usually the biggest bottleneck. We built Leadwise to autonomously research tech stacks, verify HIPAA compliance triggers, and populate reps'' pipelines with verified decision-makers.\n\nWould you be open to a 10-minute chat this Thursday at 2:00 PM EST to see how we could help your incoming AEs hit quota faster?\n\nBest regards,\nAlex | Sales Strategy @ Leadwise',
  'Referenced their $14M Series A funding and 4 active AE job postings.',
  ARRAY['Series A $14M Funding announcement','4 Outbound AE job requisitions on Careers page','Recent Salesforce CRM deployment'],
  'pending_approval'
) ON CONFLICT DO NOTHING;

INSERT INTO public.outreach_drafts (
  id, lead_id, workspace_id, channel, subject, body,
  personalized_hook, signals_cited, status
) VALUES (
  '00000000-0000-0000-0002-000000000002',
  v_lead_002, v_workspace_id, 'email',
  'Question regarding CloudScale''s Q3 SDR expansion',
  E'Hi Elena,\n\nNoticed CloudScale''s rapid expansion and your upcoming 35% growth across the outbound SDR team this quarter.\n\nGiven your focus on enterprise data analytics, manual prospecting on LinkedIn usually costs your reps 15+ hours each week. Leadwise deploys autonomous AI agents that identify enterprise teams querying data warehouses and routes them directly into your CRM.\n\nOpen to seeing a quick 3-minute personalized sample lead list for CloudScale?\n\nBest,\nJordan | Growth Partnerships',
  'Referenced their 35% SDR expansion and high pricing page engagement.',
  ARRAY['35% team headcount growth signal','Repeat pricing page visits detected'],
  'pending_approval'
) ON CONFLICT DO NOTHING;

END $$;
