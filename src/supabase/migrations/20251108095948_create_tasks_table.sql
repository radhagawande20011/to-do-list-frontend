/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `assignedTo` (text, user name)
      - `status` (text, task status: Not Started, In Progress, Completed)
      - `dueDate` (date, when task is due)
      - `priority` (text, priority level: Low, Normal, High)
      - `comments` (text, task description/comments)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for public access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignedTo text NOT NULL,
  status text NOT NULL DEFAULT 'Not Started',
  dueDate date NOT NULL,
  priority text NOT NULL DEFAULT 'Normal',
  comments text DEFAULT '',
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON tasks
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON tasks
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON tasks
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON tasks
  FOR DELETE
  TO anon
  USING (true);

INSERT INTO tasks (assignedTo, status, dueDate, priority, comments) VALUES
  ('User 1', 'Completed', '2024-12-10', 'Low', 'This task is good'),
  ('User 2', 'In Progress', '2024-09-14', 'High', 'This task is good'),
  ('User 3', 'Not Started', '2024-08-18', 'Low', 'This task is good'),
  ('User 4', 'In Progress', '2024-06-12', 'Normal', 'This task is good');

  SELECT column_name FROM information_schema.columns 
WHERE table_name = 'tasks';
