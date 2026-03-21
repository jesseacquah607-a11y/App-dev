-- Create storage bucket for musical score uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'app-afbsqlqhd4ap_score_uploads',
  'app-afbsqlqhd4ap_score_uploads',
  true,
  10485760, -- 10MB limit
  array['application/pdf', 'image/jpeg', 'image/jpg']
);

-- Allow public uploads (no auth required)
create policy "Allow public uploads"
on storage.objects for insert
to public
with check (bucket_id = 'app-afbsqlqhd4ap_score_uploads');

-- Allow public reads
create policy "Allow public reads"
on storage.objects for select
to public
using (bucket_id = 'app-afbsqlqhd4ap_score_uploads');

-- Allow public deletes (for cleanup)
create policy "Allow public deletes"
on storage.objects for delete
to public
using (bucket_id = 'app-afbsqlqhd4ap_score_uploads');