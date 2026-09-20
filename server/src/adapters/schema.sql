CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_documents_content ON documents USING gin (to_tsvector('english', content));
