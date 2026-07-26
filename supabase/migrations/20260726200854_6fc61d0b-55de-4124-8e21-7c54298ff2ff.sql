ALTER TABLE public.appointments
  ADD COLUMN consent_given BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Anyone can create appointment requests" ON public.appointments;

CREATE POLICY "Anyone can create appointment requests"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent_given = true
    AND length(full_name) BETWEEN 2 AND 100
    AND length(phone) BETWEEN 5 AND 30
    AND (email IS NULL OR length(email) <= 255)
    AND (service IS NULL OR length(service) <= 100)
    AND (message IS NULL OR length(message) <= 2000)
  );