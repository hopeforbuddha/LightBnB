insert into users(name, email, password)
values ('jacob', 'jacob.ftizgerald@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('bob', 'bob@vancerefige.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('user', 'user@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

insert into properties(owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
values (1, 'little red', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 500, 2, 2, 2, 'canada', 'seasamee st', 'pooville', 'ON', 'p0b 1l0', true),
(2, 'big blue', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 900, 5, 4, 6, 'canada', 'cobblestone ct', 'shitterton', 'ON', 'x1x 5v5', true);

insert into reservations (start_date, end_date, property_id, guest_id)
values ('2021-01-01', '2021-01-5', 2, 3),
('2020-12-1', '2020-12-25', 1, 2);

insert into property_reviews (guest_id, property_id, reservation_id, rating, message)
values (2, 1, 2, 5, 'message'),
(3, 2, 1, 2, 'message');