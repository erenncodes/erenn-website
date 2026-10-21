-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews
FOR SELECT
USING (is_approved = true);

-- Anyone can submit reviews (will need admin approval)
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
WITH CHECK (
  name IS NOT NULL AND 
  length(trim(name)) >= 2 AND 
  length(trim(name)) <= 50 AND
  review_text IS NOT NULL AND 
  length(trim(review_text)) >= 10 AND 
  length(trim(review_text)) <= 500 AND
  rating >= 1 AND rating <= 5
);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
ON public.reviews
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_reviews_approved ON public.reviews (is_approved, created_at DESC);