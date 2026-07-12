-- Intentionally no-op.
-- public.leads already exists on this Supabase project with a different CRM schema
-- (business_id, contact_name, pipeline_stage, ...).
-- Montreal Trades homeowner forms use public.quote_leads (see next migration).

select 1;
