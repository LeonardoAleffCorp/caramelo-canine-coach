
CREATE TABLE public.medication_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'geral',
  description text,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.medication_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read medication types" ON public.medication_types FOR SELECT USING (true);
CREATE POLICY "Users can insert custom medication types" ON public.medication_types FOR INSERT WITH CHECK (is_custom = true);

-- Antibióticos
INSERT INTO public.medication_types (name, category, description) VALUES
('Amoxicilina', 'antibiotico', 'Antibiótico de amplo espectro'),
('Cefalexina', 'antibiotico', 'Antibiótico cefalosporina'),
('Enrofloxacina', 'antibiotico', 'Antibiótico fluoroquinolona'),
('Metronidazol', 'antibiotico', 'Antibiótico e antiprotozoário'),
('Doxiciclina', 'antibiotico', 'Antibiótico tetraciclina'),
('Azitromicina', 'antibiotico', 'Antibiótico macrolídeo');

-- Anti-inflamatórios
INSERT INTO public.medication_types (name, category, description) VALUES
('Meloxicam', 'anti_inflamatorio', 'Anti-inflamatório não esteroidal'),
('Carprofeno', 'anti_inflamatorio', 'Anti-inflamatório não esteroidal'),
('Prednisolona', 'anti_inflamatorio', 'Corticosteroide anti-inflamatório'),
('Dexametasona', 'anti_inflamatorio', 'Corticosteroide potente'),
('Firocoxibe', 'anti_inflamatorio', 'Anti-inflamatório COX-2 seletivo');

-- Antiparasitários
INSERT INTO public.medication_types (name, category, description) VALUES
('Ivermectina', 'antiparasitario', 'Antiparasitário de amplo espectro'),
('Milbemicina', 'antiparasitario', 'Prevenção de dirofilariose'),
('Praziquantel', 'antiparasitario', 'Vermífugo para cestódeos'),
('Fenbendazol', 'antiparasitario', 'Vermífugo de amplo espectro'),
('Fluralaner (Bravecto)', 'antiparasitario', 'Antipulgas e carrapatos oral'),
('Sarolaner (Simparic)', 'antiparasitario', 'Antipulgas e carrapatos oral'),
('Afoxolaner (NexGard)', 'antiparasitario', 'Antipulgas e carrapatos oral');

-- Analgésicos
INSERT INTO public.medication_types (name, category, description) VALUES
('Tramadol', 'analgesico', 'Analgésico opioide'),
('Dipirona', 'analgesico', 'Analgésico e antitérmico'),
('Gabapentina', 'analgesico', 'Analgésico para dor neuropática');

-- Antialérgicos
INSERT INTO public.medication_types (name, category, description) VALUES
('Oclacitinibe (Apoquel)', 'antialergico', 'Antialérgico para dermatite atópica'),
('Difenidramina', 'antialergico', 'Anti-histamínico'),
('Cetirizina', 'antialergico', 'Anti-histamínico de segunda geração');

-- Gastrointestinais
INSERT INTO public.medication_types (name, category, description) VALUES
('Omeprazol', 'gastrointestinal', 'Protetor gástrico'),
('Ranitidina', 'gastrointestinal', 'Antiácido'),
('Ondansetrona', 'gastrointestinal', 'Antiemético'),
('Metoclopramida', 'gastrointestinal', 'Antiemético e pró-cinético'),
('Sucralfato', 'gastrointestinal', 'Protetor de mucosa gástrica');

-- Cardíacos
INSERT INTO public.medication_types (name, category, description) VALUES
('Enalapril', 'cardiaco', 'Inibidor da ECA para insuficiência cardíaca'),
('Pimobendan', 'cardiaco', 'Inodilatador cardíaco'),
('Furosemida', 'cardiaco', 'Diurético para edema'),
('Espironolactona', 'cardiaco', 'Diurético poupador de potássio');

-- Dermatológicos
INSERT INTO public.medication_types (name, category, description) VALUES
('Cetoconazol', 'dermatologico', 'Antifúngico'),
('Itraconazol', 'dermatologico', 'Antifúngico sistêmico'),
('Clorexidina', 'dermatologico', 'Antisséptico tópico');

-- Suplementos
INSERT INTO public.medication_types (name, category, description) VALUES
('Condroitina + Glucosamina', 'suplemento', 'Protetor articular'),
('Ômega 3 (EPA/DHA)', 'suplemento', 'Anti-inflamatório natural para pele e articulações'),
('Probiótico veterinário', 'suplemento', 'Saúde intestinal'),
('Silimarina', 'suplemento', 'Protetor hepático');
