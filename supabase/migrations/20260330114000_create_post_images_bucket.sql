insert into storage.buckets (id, name, public)
values ('post_images', 'post_images', true)
on conflict (id) do nothing;

create policy "Images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'post_images' );

create policy "Admins can upload images."
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post_images' AND
    public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can update images."
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'post_images' AND
    public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can delete images."
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post_images' AND
    public.has_role(auth.uid(), 'admin')
  );
