INSERT INTO roles (id, name, description)
VALUES
(1, 'admin', 'special role'),
(2, 'user', 'normal user');

SELECT setval('public.roles_id_seq', 3);
