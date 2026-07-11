-- =====================================
-- HALO MARKETPLACE DATABASE SCHEMA
-- Supabase PostgreSQL
-- =====================================


-- EXTENSIONS

create extension if not exists "uuid-ossp";



-- =====================================
-- USERS
-- =====================================


create table public.users (

id uuid primary key default uuid_generate_v4(),

email text unique not null,

full_name text,

avatar_url text,

role text default 'buyer'
check (
role in ('buyer','seller','admin')
),

phone text,

created_at timestamp with time zone default now(),

updated_at timestamp with time zone default now()

);





-- =====================================
-- SELLER STORES
-- =====================================


create table public.stores (

id uuid primary key default uuid_generate_v4(),

owner_id uuid references public.users(id)
on delete cascade,

store_name text not null,

description text,

logo_url text,

banner_url text,

verified boolean default false,

rating numeric(3,2)
default 0,

created_at timestamp with time zone default now()

);






-- =====================================
-- CATEGORIES
-- =====================================


create table public.categories (

id uuid primary key default uuid_generate_v4(),

name text unique not null,

slug text unique not null,

image_url text,

created_at timestamp with time zone default now()

);







-- =====================================
-- PRODUCTS
-- =====================================


create table public.products (

id uuid primary key default uuid_generate_v4(),


store_id uuid references public.stores(id)
on delete cascade,


category_id uuid references public.categories(id),


title text not null,


slug text unique,


description text,


price numeric(10,2) not null,


compare_price numeric(10,2),


sku text,


inventory integer default 0,


images jsonb default '[]',


status text default 'active'
check(
status in (
'active',
'draft',
'sold',
'disabled'
)
),



-- AI FIELDS

ai_description text,

ai_tags jsonb default '[]',

ai_score integer default 0,



created_at timestamp with time zone default now(),


updated_at timestamp with time zone default now()

);








-- =====================================
-- CARTS
-- =====================================


create table public.carts (

id uuid primary key default uuid_generate_v4(),


user_id uuid references public.users(id)
on delete cascade,


created_at timestamp with time zone default now()

);







-- =====================================
-- CART ITEMS
-- =====================================


create table public.cart_items (

id uuid primary key default uuid_generate_v4(),


cart_id uuid references public.carts(id)
on delete cascade,


product_id uuid references public.products(id)
on delete cascade,


quantity integer default 1

);








-- =====================================
-- ORDERS
-- =====================================


create table public.orders (

id uuid primary key default uuid_generate_v4(),


buyer_id uuid references public.users(id),


store_id uuid references public.stores(id),



status text default 'pending'
check(
status in(
'pending',
'paid',
'shipped',
'completed',
'cancelled'
)
),



subtotal numeric(10,2),


tax numeric(10,2),


total numeric(10,2),



stripe_payment_id text,



created_at timestamp with time zone default now()

);








-- =====================================
-- ORDER ITEMS
-- =====================================


create table public.order_items (

id uuid primary key default uuid_generate_v4(),


order_id uuid references public.orders(id)
on delete cascade,


product_id uuid references public.products(id),


quantity integer,


price numeric(10,2)

);









-- =====================================
-- PAYMENTS
-- =====================================


create table public.payments (

id uuid primary key default uuid_generate_v4(),


order_id uuid references public.orders(id),


stripe_session_id text,


stripe_customer_id text,


amount numeric(10,2),


status text,


created_at timestamp default now()

);








-- =====================================
-- REVIEWS
-- =====================================


create table public.reviews (

id uuid primary key default uuid_generate_v4(),


product_id uuid references public.products(id)
on delete cascade,


user_id uuid references public.users(id),


rating integer
check(
rating between 1 and 5
),


comment text,


created_at timestamp default now()

);








-- =====================================
-- WISHLIST
-- =====================================


create table public.wishlists (

id uuid primary key default uuid_generate_v4(),


user_id uuid references public.users(id)
on delete cascade,


product_id uuid references public.products(id)
on delete cascade,


created_at timestamp default now(),



unique(user_id,product_id)

);








-- =====================================
-- MESSAGES
-- =====================================


create table public.messages (

id uuid primary key default uuid_generate_v4(),


sender_id uuid references public.users(id),


receiver_id uuid references public.users(id),


message text not null,


read boolean default false,


created_at timestamp default now()

);








-- =====================================
-- PRODUCT SEARCH INDEX
-- =====================================


create index products_search_idx

on public.products

using gin(
to_tsvector(
'english',
title || ' ' || description
)
);







-- =====================================
-- UPDATED TIMESTAMP FUNCTION
-- =====================================


create or replace function update_timestamp()

returns trigger as $$

begin

new.updated_at = now();

return new;

end;

$$ language plpgsql;






create trigger products_updated

before update on public.products

for each row

execute procedure update_timestamp();






create trigger users_updated

before update on public.users

for each row

execute procedure update_timestamp();







-- =====================================
-- SAMPLE CATEGORIES
-- =====================================


insert into public.categories
(name,slug)

values

('Electronics','electronics'),

('Vehicles','vehicles'),

('Home','home'),

('Fashion','fashion'),

('Services','services')

on conflict do nothing;
