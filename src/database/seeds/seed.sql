-- Limpia datos anteriores
TRUNCATE TABLE employees RESTART IDENTITY CASCADE;
TRUNCATE TABLE requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE request_status_history RESTART IDENTITY CASCADE;

-- APPROVER
INSERT INTO employees (
    id, name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
  'a8b6d412-c66d-487a-832f-7017ddfcf348',
  'Laura Manager',
  'laura.manager@katu.com',
  'APPROVER',
  0,
  0,
  NOW(),
  NOW()
);

-- EMPLOYEE 1
INSERT INTO employees (
   id, name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
  'a849f1d5-d223-4b92-823e-9ad41e24ef5c',
  'Carlos Employee',
  'carlos@katu.com',
  'EMPLOYEE',
  12,
  3,
  NOW(),
  NOW()
);

-- EMPLOYEE 2
INSERT INTO employees (
   id, name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
  '7b2eca07-7b9b-4ef3-a4d4-c63bd6db53dc',
  'Ana Employee',
  'ana@katu.com',
  'EMPLOYEE',
  10,
  0,
  NOW(),
  NOW()
);
