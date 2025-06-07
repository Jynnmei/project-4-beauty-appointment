CREATE TABLE users (
  user_id serial PRIMARY KEY,
  username varchar(50) NOT NULL,
  address varchar(100) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  hash_password varchar(100) NOT NULL,
  phone char(8) UNIQUE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  role_id int REFERENCES roles(id)
);


CREATE TABLE roles (
	id serial PRIMARY KEY,
	name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE appointment (
  appointment_id serial PRIMARY KEY,
  client_id int REFERENCES users(user_id),
  type_id int REFERENCES types(id),
  vendor_id INT REFERENCES users(user_id),
  service_id INT REFERENCES service(service_id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status_id int REFERENCES status(id) DEFAULT 1
);

-- 先添加新字段
ALTER TABLE appointment ADD COLUMN appointment_datetime TIMESTAMP;

-- 将旧的 date + time 合并进新字段
UPDATE appointment
SET appointment_datetime = date + time;

-- 删除旧字段
ALTER TABLE appointment DROP COLUMN date;
ALTER TABLE appointment DROP COLUMN time;

ALTER TABLE appointment ADD COLUMN updated_at TIMESTAMP;

CREATE TABLE types (
	id serial PRIMARY KEY,
	name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE status (
	id serial PRIMARY KEY,
	name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE service_catalog (
  catalog_id serial PRIMARY KEY,
  title varchar(100) NOT NULL,
  description varchar(200) NOT NULL,
  price numeric(5,2) NOT NULL,
  duration int NOT NULL
);

CREATE TABLE service (
  service_id serial PRIMARY KEY,
  vendor_id int REFERENCES users(user_id),
  catalog_id int REFERENCES service_catalog(catalog_id)
);


INSERT INTO roles (name) VALUES 
  ('CLIENT'), 
  ('VENDOR');

INSERT INTO types (name) VALUES 
  ('SINGLE FACIAL'), 
  ('DOUBLE FACIAL');

INSERT INTO status (name) VALUES 
  ('PENDING'), 
  ('CONFIRMED'),
  ('COMPLETED');

SELECT * FROM roles;
SELECT * FROM types;
SELECT * FROM status;

CREATE TABLE vendor_price_images (
    id serial PRIMARY KEY,
    vendor_id int NOT NULL REFERENCES users(user_id),
    image_url text NOT NULL,
    uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE vendor_price_images
ADD COLUMN vendor_price_images_id INTEGER REFERENCES vendor_price_images(id) ON DELETE CASCADE;

CREATE TABLE appointment_vendor (
  appointment_id INT REFERENCES appointment(appointment_id),
  vendor_id INT REFERENCES users(user_id),
  PRIMARY KEY (appointment_id, vendor_id)
);

CREATE TABLE appointment_service (
  appointment_id INT REFERENCES appointment(appointment_id),
  service_id INT REFERENCES service(service_id),
  PRIMARY KEY (appointment_id, service_id)
);

INSERT INTO users (username, address, email, hash_password, phone, role_id) VALUES ('JYNN', 'YewTee', 'jynn@testing.com', '123example','88569999', 2);

INSERT INTO users (username, address, email, hash_password, phone, role_id) VALUES ('Yee Ling', 'Yishun', 'ling@testing.com', '123example','88833222', 1);
