BEGIN;

-- =========================
-- LIMPIEZA
-- =========================
TRUNCATE TABLE request_status_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE employees RESTART IDENTITY CASCADE;

-- =========================
-- EMPLOYEES
-- -- =========================

-- APPROVER
INSERT INTO employees VALUES (
  'b9a342fa-54a7-4761-9eea-0225e9db2b7f',
  'Laura Manager',
  'laura.manager@katu.com',
  'APPROVER',
  0,
  0,
  NOW(),
  NOW()
);

-- EMPLOYEES
INSERT INTO employees VALUES
('e3272e61-b945-4ff7-876f-f67653eeef07','Carlos Employee','carlos@katu.com','EMPLOYEE',12,3,NOW(),NOW()),
('5ec9c836-7f89-4d85-b0bb-b9878bbc0862','Ana Employee','ana@katu.com','EMPLOYEE',10,0,NOW(),NOW()),
('22104f97-557e-4d6e-bab1-82e215ae26d6','Luis Employee','luis@katu.com','EMPLOYEE',15,2,NOW(),NOW()),
('c98d8a06-b794-4c01-a788-6427d9da4f3e','Maria Employee','maria@katu.com','EMPLOYEE',8,1,NOW(),NOW()),
('0242572c-8a84-4819-8245-af18f8ea2429','Jose Employee','jose@katu.com','EMPLOYEE',20,5,NOW(),NOW());

-- =========================
-- REQUESTS (10 VACATION)
-- =========================
INSERT INTO requests VALUES
('022a3add-c15f-4d6e-9bd9-f7532aef19d3','e3272e61-b945-4ff7-876f-f67653eeef07','VACATION','2025-12-19','2025-12-23',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('6153a47c-e898-40d9-a049-b87f49fa8468','5ec9c836-7f89-4d85-b0bb-b9878bbc0862','VACATION','2025-12-19','2025-12-23',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('61a7a9c3-fb54-4141-a4a4-9bb8a1fadb57','22104f97-557e-4d6e-bab1-82e215ae26d6','VACATION','2025-12-19','2025-12-23',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('7fdadc48-45f0-496a-82ab-d9b1c6589c6c','c98d8a06-b794-4c01-a788-6427d9da4f3e','VACATION','2025-12-19','2025-12-23',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('a44f5a09-92a7-40f6-a7a2-c2758a5c6dac','0242572c-8a84-4819-8245-af18f8ea2429','VACATION','2025-12-19','2025-12-23',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('2237e842-6346-4283-a709-9e84ed87426a','e3272e61-b945-4ff7-876f-f67653eeef07','VACATION','2025-12-24','2025-12-29',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('a013ecc2-6506-4463-9df4-30fc1c27b6fb','5ec9c836-7f89-4d85-b0bb-b9878bbc0862','VACATION','2025-12-24','2025-12-29',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('becdeed3-80ee-4832-b62d-d6279123db4b','22104f97-557e-4d6e-bab1-82e215ae26d6','VACATION','2025-12-24','2025-12-29',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('0be97c10-277b-48ed-8e14-fb5c68a88485','c98d8a06-b794-4c01-a788-6427d9da4f3e','VACATION','2025-12-24','2025-12-29',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW()),
('39984bdb-0a12-44f7-b595-56ca3eaa9116','0242572c-8a84-4819-8245-af18f8ea2429','VACATION','2025-12-24','2025-12-29',NULL,NULL,'Vacaciones de verano','PENDING',NULL,NOW(),NOW());

-- =========================
-- REQUESTS (10 PERMISSION)
-- =========================
INSERT INTO requests VALUES
('40df28cc-6a96-4284-bb66-60ace8c89804','e3272e61-b945-4ff7-876f-f67653eeef07','PERMISSION','2025-12-25','2025-12-25','09:00','11:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('fe6e4911-d284-4ed2-a4e6-1a1c5da2ee7d','e3272e61-b945-4ff7-876f-f67653eeef07','PERMISSION','2025-12-25','2025-12-25','11:00','13:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('e7e48696-5beb-4a9d-8bba-e757c5d3a0f5','5ec9c836-7f89-4d85-b0bb-b9878bbc0862','PERMISSION','2025-12-25','2025-12-25','09:00','11:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('a85e5deb-e3ba-4520-8b36-d79d3ac0b49b','5ec9c836-7f89-4d85-b0bb-b9878bbc0862','PERMISSION','2025-12-25','2025-12-25','11:00','13:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('99df71cb-bb2d-4654-8f92-ab4c4e47655b','22104f97-557e-4d6e-bab1-82e215ae26d6','PERMISSION','2025-12-25','2025-12-25','09:00','11:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('62922ed2-0960-4725-9239-3e706b242eed','22104f97-557e-4d6e-bab1-82e215ae26d6','PERMISSION','2025-12-25','2025-12-25','11:00','13:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('42d485fc-2312-4920-9280-1e79727792c2','c98d8a06-b794-4c01-a788-6427d9da4f3e','PERMISSION','2025-12-25','2025-12-25','09:00','11:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('56213f9c-7006-49c9-88bb-38228226d2b0','c98d8a06-b794-4c01-a788-6427d9da4f3e','PERMISSION','2025-12-25','2025-12-25','11:00','13:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('a1ee50c6-23d5-4b33-a397-a496d9f5b2bd','0242572c-8a84-4819-8245-af18f8ea2429','PERMISSION','2025-12-25','2025-12-25','09:00','11:00','Medical appointment','PENDING',NULL,NOW(),NOW()),
('99baf80c-449d-49f7-95cf-c4bc127ec9a9','0242572c-8a84-4819-8245-af18f8ea2429','PERMISSION','2025-12-25','2025-12-25','11:00','13:00','Medical appointment','PENDING',NULL,NOW(),NOW());

-- =========================
-- STATUS HISTORY (1 POR REQUEST)
-- =========================
INSERT INTO request_status_history VALUES
('eb1d2ff9-d5f8-43d1-9cf6-316270e74728','a1ee50c6-23d5-4b33-a397-a496d9f5b2bd','CREATED','PENDING','0242572c-8a84-4819-8245-af18f8ea2429',NOW()),
('e9880128-9c57-4016-8b5f-145305459323','61a7a9c3-fb54-4141-a4a4-9bb8a1fadb57','CREATED','PENDING','22104f97-557e-4d6e-bab1-82e215ae26d6',NOW()),
('e31c4821-74de-4ab0-a4d0-2bdff38cf242','022a3add-c15f-4d6e-9bd9-f7532aef19d3','CREATED','PENDING','e3272e61-b945-4ff7-876f-f67653eeef07',NOW()),
('cef369fe-0d71-4f2a-850a-27b7db943ec1','62922ed2-0960-4725-9239-3e706b242eed','CREATED','PENDING','22104f97-557e-4d6e-bab1-82e215ae26d6',NOW()),
('c5b505cc-573e-41f7-bd04-71e97b052e52','e7e48696-5beb-4a9d-8bba-e757c5d3a0f5','CREATED','PENDING','5ec9c836-7f89-4d85-b0bb-b9878bbc0862',NOW()),
('b5f6d52b-e0bf-423f-81b6-a86ea32a22b8','0be97c10-277b-48ed-8e14-fb5c68a88485','CREATED','PENDING','c98d8a06-b794-4c01-a788-6427d9da4f3e',NOW()),
('b43aa700-0995-42d5-94b3-674a1a20aca3','a44f5a09-92a7-40f6-a7a2-c2758a5c6dac','CREATED','PENDING','0242572c-8a84-4819-8245-af18f8ea2429',NOW()),
('ae2cbd70-aafc-4dfd-9af9-98df6d4963a5','2237e842-6346-4283-a709-9e84ed87426a','CREATED','PENDING','e3272e61-b945-4ff7-876f-f67653eeef07',NOW()),
('a2e17eab-22be-4e04-ba37-b925a734c74c','a85e5deb-e3ba-4520-8b36-d79d3ac0b49b','CREATED','PENDING','5ec9c836-7f89-4d85-b0bb-b9878bbc0862',NOW()),
('9c86f2a9-945b-4dc1-887e-68104288875f','42d485fc-2312-4920-9280-1e79727792c2','CREATED','PENDING','c98d8a06-b794-4c01-a788-6427d9da4f3e',NOW()),
('9b1a7ba8-8b61-43f1-9449-8a774eeaa46a','fe6e4911-d284-4ed2-a4e6-1a1c5da2ee7d','CREATED','PENDING','e3272e61-b945-4ff7-876f-f67653eeef07',NOW()),
('8300e98e-b47c-4c43-818c-05d10a97b11e','40df28cc-6a96-4284-bb66-60ace8c89804','CREATED','PENDING','e3272e61-b945-4ff7-876f-f67653eeef07',NOW()),
('78a621c6-310d-4ba5-a867-ce7f17c4e0bf','99baf80c-449d-49f7-95cf-c4bc127ec9a9','CREATED','PENDING','0242572c-8a84-4819-8245-af18f8ea2429',NOW()),
('750522ba-6b53-4ba4-8068-190deaf630b1','becdeed3-80ee-4832-b62d-d6279123db4b','CREATED','PENDING','22104f97-557e-4d6e-bab1-82e215ae26d6',NOW()),
('628d9886-c7bb-46a4-b0fe-7dac44e7a1ec','99df71cb-bb2d-4654-8f92-ab4c4e47655b','CREATED','PENDING','22104f97-557e-4d6e-bab1-82e215ae26d6',NOW()),
('48d2a95a-ccf1-4d09-9b5c-15c0b21afcc3','6153a47c-e898-40d9-a049-b87f49fa8468','CREATED','PENDING','5ec9c836-7f89-4d85-b0bb-b9878bbc0862',NOW()),
('3b9b9560-20f8-40a9-84af-51105810563c','a013ecc2-6506-4463-9df4-30fc1c27b6fb','CREATED','PENDING','5ec9c836-7f89-4d85-b0bb-b9878bbc0862',NOW()),
('2ff68089-13b5-4b00-900e-40f1c1951ee1','7fdadc48-45f0-496a-82ab-d9b1c6589c6c','CREATED','PENDING','c98d8a06-b794-4c01-a788-6427d9da4f3e',NOW()),
('197cf068-7baa-4673-9b92-6ed24046a855','39984bdb-0a12-44f7-b595-56ca3eaa9116','CREATED','PENDING','0242572c-8a84-4819-8245-af18f8ea2429',NOW()),
('1670f495-0508-48f4-8b1c-b90db0816a55','56213f9c-7006-49c9-88bb-38228226d2b0','CREATED','PENDING','c98d8a06-b794-4c01-a788-6427d9da4f3e',NOW());

COMMIT;
