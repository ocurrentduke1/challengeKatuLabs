CREATE TABLE request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id),
  previous_status TEXT,
  new_status TEXT,
  changed_by UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT now()
);
