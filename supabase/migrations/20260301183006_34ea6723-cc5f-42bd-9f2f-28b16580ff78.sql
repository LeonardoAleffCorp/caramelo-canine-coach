
-- Create storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-photos', 'pet-photos', true);

-- Allow authenticated users to upload their pet photos
CREATE POLICY "Users can upload pet photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pet-photos' AND auth.uid() IS NOT NULL);

-- Allow anyone to view pet photos (public bucket)
CREATE POLICY "Anyone can view pet photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-photos');

-- Allow users to update their own pet photos
CREATE POLICY "Users can update own pet photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pet-photos' AND auth.uid() IS NOT NULL);

-- Allow users to delete their own pet photos
CREATE POLICY "Users can delete own pet photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'pet-photos' AND auth.uid() IS NOT NULL);
