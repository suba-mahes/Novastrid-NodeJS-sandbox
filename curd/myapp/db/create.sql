/*user database*/
create database db;
/*user table*/
create table user(
user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NULL,
email_id VARCHAR(50) NOT NULL,
dof DATE NOT NULL
);

/*useraddress table*/
create table user_address(
user_address_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
address1 VARCHAR(30) NOT NULL,
address2 VARCHAR(50),
city VARCHAR(20) NOT NULL,
state VARCHAR(20) NOT NULL,
country VARCHAR(20) NOT NULL,
pin_number INT NOT NULL,
user_id int not null,
FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);



