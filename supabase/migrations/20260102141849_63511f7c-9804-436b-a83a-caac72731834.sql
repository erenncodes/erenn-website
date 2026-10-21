-- Rate limit tracking for public endpoints (used by backend functions)
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index if not exists rate_limits_scope_key_window_uidx
  on public.rate_limits (scope, key, window_start);

alter table public.rate_limits enable row level security;


-- Server-side validation for guest/anon order creation
create or replace function public.validate_order_input()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_email text;
  v_name text;
begin
  v_email := lower(trim(new.customer_email));
  v_name := trim(new.customer_name);

  if v_email is null or v_email = '' then
    raise exception 'Customer email is required';
  end if;
  if length(v_email) > 255 then
    raise exception 'Email too long';
  end if;
  if v_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'Invalid email format';
  end if;

  if v_name is null or length(v_name) < 2 or length(v_name) > 100 then
    raise exception 'Name must be between 2 and 100 characters';
  end if;

  if new.product_id is null then
    raise exception 'Product is required';
  end if;

  if new.payment_method is null or trim(new.payment_method) = '' then
    raise exception 'Payment method is required';
  end if;

  if new.payment_screenshot_url is null or trim(new.payment_screenshot_url) = '' then
    raise exception 'Payment screenshot is required';
  end if;
  if length(new.payment_screenshot_url) > 512 then
    raise exception 'Payment screenshot reference is too long';
  end if;

  if new.amount is null or new.amount <= 0 then
    raise exception 'Amount must be greater than 0';
  end if;

  -- Normalize and clamp
  new.customer_email := v_email;
  new.customer_name := v_name;
  new.status := 'pending';
  if new.notes is not null then
    new.notes := left(new.notes, 500);
  end if;

  return new;
end;
$$;

drop trigger if exists validate_order_before_insert on public.orders;
create trigger validate_order_before_insert
before insert on public.orders
for each row
execute function public.validate_order_input();


-- Tighten guest checkout order creation policy to reduce data pollution.
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders
for insert
to anon, authenticated
with check (
  customer_email is not null
  and length(customer_email) <= 255
  and customer_name is not null
  and length(btrim(customer_name)) between 2 and 100
  and product_id is not null
  and payment_method is not null
  and payment_screenshot_url is not null
  and btrim(payment_screenshot_url) <> ''
  and amount > 0
);


-- Remove direct public uploads to payment-screenshots; use signed uploads via backend function instead.
drop policy if exists "Guests can upload to guest folder" on storage.objects;
drop policy if exists "Users can upload to own folder" on storage.objects;
