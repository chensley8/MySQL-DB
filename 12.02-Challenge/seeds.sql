INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Representative', 50000, 1),
  ('Marketing Specialist', 60000, 2),
  ('Software Engineer', 80000, 3);

INSERT INTO employees (first_name, last_name, role_id) VALUES
  ('John', 'Doe', 1),
  ('Jane', 'Smith', 2),
  ('Bob', 'Johnson', 3);