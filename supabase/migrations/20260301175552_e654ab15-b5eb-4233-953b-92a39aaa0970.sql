
-- Create breeds table with extensive Brazilian dog breeds
CREATE TABLE public.breeds (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  size_category text NOT NULL DEFAULT 'médio',
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read breeds" ON public.breeds FOR SELECT USING (true);
CREATE POLICY "Users can insert custom breeds" ON public.breeds FOR INSERT WITH CHECK (is_custom = true);

-- Seed breeds
INSERT INTO public.breeds (name, size_category) VALUES
('Vira-lata/SRD', 'variado'),
('Labrador Retriever', 'grande'),
('Golden Retriever', 'grande'),
('Bulldog Francês', 'pequeno'),
('Bulldog Inglês', 'médio'),
('Poodle Toy', 'pequeno'),
('Poodle Miniatura', 'pequeno'),
('Poodle Standard', 'médio'),
('Pastor Alemão', 'grande'),
('Shih Tzu', 'pequeno'),
('Yorkshire Terrier', 'pequeno'),
('Pinscher Miniatura', 'pequeno'),
('Rottweiler', 'grande'),
('Beagle', 'médio'),
('Husky Siberiano', 'grande'),
('Border Collie', 'grande'),
('Pitbull', 'grande'),
('American Bully', 'médio'),
('Dachshund (Salsicha)', 'pequeno'),
('Maltês', 'pequeno'),
('Lhasa Apso', 'pequeno'),
('Chow Chow', 'médio'),
('Akita Inu', 'grande'),
('Boxer', 'grande'),
('Dobermann', 'grande'),
('Dálmata', 'grande'),
('Schnauzer Miniatura', 'pequeno'),
('Schnauzer Standard', 'médio'),
('Cocker Spaniel Inglês', 'médio'),
('Cocker Spaniel Americano', 'médio'),
('Bichon Frisé', 'pequeno'),
('Pug', 'pequeno'),
('Chihuahua', 'pequeno'),
('Spitz Alemão (Lulu da Pomerânia)', 'pequeno'),
('Cane Corso', 'grande'),
('Pastor Belga Malinois', 'grande'),
('Dogo Argentino', 'grande'),
('Fila Brasileiro', 'grande'),
('Weimaraner', 'grande'),
('Pointer Inglês', 'grande'),
('Jack Russell Terrier', 'pequeno'),
('Cavalier King Charles', 'pequeno'),
('Bernese Mountain Dog', 'grande'),
('São Bernardo', 'grande'),
('Shar Pei', 'médio'),
('Bull Terrier', 'médio'),
('Whippet', 'médio'),
('Galgo', 'grande'),
('West Highland White Terrier', 'pequeno'),
('Pomerânia', 'pequeno'),
('Papillon', 'pequeno'),
('Basenji', 'médio'),
('Vizsla', 'grande'),
('Pastor Australiano', 'grande'),
('Corgi Pembroke', 'pequeno'),
('Corgi Cardigan', 'pequeno'),
('Shiba Inu', 'médio'),
('Samoyeda', 'grande'),
('Malamute do Alasca', 'grande'),
('Terra Nova', 'grande');

-- Add birth_date to pets table
ALTER TABLE public.pets ADD COLUMN birth_date date;
