-- Create level_thresholds table
CREATE TABLE IF NOT EXISTS public.level_thresholds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    core_required DECIMAL(20, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.level_thresholds ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read level thresholds
DROP POLICY IF EXISTS "Level thresholds are viewable by everyone" ON public.level_thresholds;
CREATE POLICY "Level thresholds are viewable by everyone"
    ON public.level_thresholds
    FOR SELECT
    USING (true);

-- Insert level thresholds (1-40)
INSERT INTO public.level_thresholds (level, core_required) VALUES
    (1, 2),
    (2, 4),
    (3, 8),
    (4, 16),
    (5, 32),
    (6, 64),
    (7, 128),
    (8, 250),
    (9, 500),
    (10, 1000),
    (11, 2000),
    (12, 4000),
    (13, 8000),
    (14, 16000),
    (15, 32000),
    (16, 64000),
    (17, 128000),
    (18, 250000),
    (19, 500000),
    (20, 1000000),
    (21, 2000000),
    (22, 4000000),
    (23, 8000000),
    (24, 16000000),
    (25, 32000000),
    (26, 64000000),
    (27, 128000000),
    (28, 250000000),
    (29, 500000000),
    (30, 1000000000),
    (31, 2000000000),
    (32, 4000000000),
    (33, 8000000000),
    (34, 16000000000),
    (35, 32000000000),
    (36, 64000000000),
    (37, 128000000000),
    (38, 250000000000),
    (39, 500000000000),
    (40, 1000000000000)
ON CONFLICT (level) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_level_thresholds_core 
    ON public.level_thresholds(core_required);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';


DROP TRIGGER IF EXISTS update_level_thresholds_updated_at ON public.level_thresholds;
CREATE TRIGGER update_level_thresholds_updated_at 
    BEFORE UPDATE ON public.level_thresholds 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
