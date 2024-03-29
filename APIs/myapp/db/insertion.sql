-- one to one
insert into users
(first_name, last_name, email_id, createdAt, updatedAt)
values
('aaa','zzz','qqq@gmail.com','2024-04-04','2024-04-04');

insert into user_addresses
  (address1, address2, city, state, country,user_id, createdAt, updatedAt)
values
  ('1659 ewsb', 'tnhb colon,villapuram', 'Madurai', 'Tamil nadu', 'India',1,'2024-04-04','2024-04-04');

-- one to many
insert into user_tables
(first_name, last_name, email_id)
values
('aaa','zzz','qqq@gmail.com');

insert into user_address_tables
  (address_name, address1, address2, city, state, country,user_id)
values
  ('office_address', '1659 ewsb', 'tnhb colon,villapuram', 'Madurai', 'Tamil nadu', 'India',1),
  ('home_address', '1659 ewsb', 'tnhb colony,villapuram', 'Madurai', 'Tamil nadu', 'India',1);

-- many to many
insert into actors
(first_name, last_name)
values
('aaa','zzz'),
('bbb','yyy');

insert into movies
(movie_name)
values
('asdf');

insert into actormovies
(movie_id,actor_id)
values
(1,1),
(1,2);