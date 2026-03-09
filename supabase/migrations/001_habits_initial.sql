/*
  # PUT THIS INTO SUPABASE SCHEMA TO CREATE THE HABITS TABLE
  # Create habits table
*/

-- Drop table if already exists, this is just to have a fresh start
DROP TABLE IF EXISTS habits CASCADE;

-- Create table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  completed boolean DEFAULT false, -- We will use the completed field to track a habit's completion
  created_at timestamptz DEFAULT now()
);