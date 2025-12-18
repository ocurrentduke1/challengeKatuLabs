-- APPROVER
INSERT INTO employees (
    name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
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
   name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
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
   name, email, role, annual_vacation_days, carried_over_days, created_at, updated_at
) VALUES (
  'Ana Employee',
  'ana@katu.com',
  'EMPLOYEE',
  10,
  0,
  NOW(),
  NOW()
);
