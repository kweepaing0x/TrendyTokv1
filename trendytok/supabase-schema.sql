-- ════════════════════════════════════════════
-- TrendyTok — Supabase SQL Schema
-- Paste this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── VIDEOS TABLE ──
create table public.videos (
  id            uuid primary key default uuid_generate_v4(),
  seller        text not null,
  description_en text not null,
  description_my text,
  tags          text[] default '{}',
  trending_pct  int default 50 check (trending_pct between 0 and 100),
  trending_label text default 'HOT' check (trending_label in ('HOT','WARM','COOL')),
  video_url     text,         -- Supabase Storage URL
  bg_emoji      text default '🎬',
  bg_color      text default 'from-rose-950 to-pink-900',
  likes         int default 0,
  views         int default 0,
  created_by    uuid references auth.users(id),
  created_at    timestamptz default now()
);

-- ── PRODUCTS TABLE ──
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  name_en         text not null,
  name_my         text,
  desc_en         text,
  desc_my         text,
  instruction_en  text,
  instruction_my  text,
  price_thb       numeric(10,2) not null,
  category        text default 'Fashion',
  emoji           text default '📦',
  badge           text,
  badge_color     text,
  trending_pct    int default 0,
  photos          text[] default '{}',  -- Supabase Storage URLs
  in_stock        boolean default true,
  created_by      uuid references auth.users(id),
  created_at      timestamptz default now()
);

-- ── VIDEO PRODUCTS (linking table) ──
create table public.video_products (
  id          uuid primary key default uuid_generate_v4(),
  video_id    uuid references public.videos(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  position    text default 'left',   -- 'left' | 'right'
  unique(video_id, product_id)
);

-- ── ORDERS TABLE ──
create table public.orders (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id),
  items         jsonb not null,       -- [{product_id, name, price_thb, qty}]
  total_thb     numeric(10,2),
  total_mmk     numeric(14,2),
  status        text default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  buyer_name    text,
  buyer_phone   text,
  ship_address  text,
  created_at    timestamptz default now()
);

-- ── ADMIN ROLES TABLE ──
create table public.admin_users (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid references auth.users(id) unique,
  email     text not null unique,
  role      text default 'admin' check (role in ('admin','superadmin')),
  created_at timestamptz default now()
);

-- ════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════

alter table public.videos        enable row level security;
alter table public.products      enable row level security;
alter table public.video_products enable row level security;
alter table public.orders        enable row level security;
alter table public.admin_users   enable row level security;

-- PUBLIC can read videos & products
create policy "Public read videos"    on public.videos    for select using (true);
create policy "Public read products"  on public.products  for select using (true);
create policy "Public read vp"        on public.video_products for select using (true);

-- Only admins can insert/update/delete videos & products
create policy "Admins write videos" on public.videos
  for all using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "Admins write products" on public.products
  for all using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "Admins write vp" on public.video_products
  for all using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- Orders: users can read their own, admins can read all
create policy "Users read own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users insert orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins read all orders" on public.orders
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- Admin users table: only admins can read
create policy "Admins read admin_users" on public.admin_users
  for select using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- ════════════════════════════════════════════
-- STORAGE BUCKETS
-- Run in Supabase Dashboard → Storage → Create bucket
-- ════════════════════════════════════════════
-- Bucket: "videos"    → public: true
-- Bucket: "products"  → public: true
-- (Create these manually in the dashboard)

-- ════════════════════════════════════════════
-- SEED: Add your first admin user
-- Replace with your real Supabase user UUID after signing up
-- ════════════════════════════════════════════
-- insert into public.admin_users (user_id, email, role)
-- values ('YOUR-SUPABASE-USER-UUID', 'admin@trendytok.app', 'superadmin');

-- ════════════════════════════════════════════
-- SAMPLE DATA (optional)
-- ════════════════════════════════════════════
insert into public.videos (seller, description_en, description_my, tags, trending_pct, trending_label, bg_emoji)
values
  ('@beauty_mm_official', '✨ New luxury bag collection just arrived! Limited stock from Korea 🇰🇷', '✨ ကိုရီးယားမှ အိတ်သစ်များ ရောက်ရှိပြီ!', ARRAY['#LuxuryBag','#KoreaFashion','#TrendyTok'], 85, 'HOT', '👜'),
  ('@sneaker_king_th', '🔥 Best sneakers for 2025 — comfort meets style. Ships to Myanmar!', '🔥 ၂၀၂၅ ခုနှစ် အကောင်းဆုံး sneakers', ARRAY['#Sneakers','#ShipToMyanmar'], 70, 'WARM', '👟'),
  ('@naturalskin_mm', '🌿 Natural serum for glowing skin — visible results in 2 weeks!', '🌿 သဘာဝဆေးများဖြင့် ပြုလုပ်သော ဆေးရည်', ARRAY['#Skincare','#NaturalBeauty'], 30, 'COOL', '🌿');

insert into public.products (name_en, name_my, desc_en, desc_my, instruction_en, instruction_my, price_thb, category, emoji, badge, badge_color, trending_pct)
values
  ('Korean Luxury Handbag', 'ကိုရီးယားဂရုနှင်းအိတ်', 'Premium quality leather handbag from Korea. 5 colors available.', 'ကိုရီးယားနိုင်ငံမှ တင်သွင်းသော အရည်အသွေးကောင်း အိတ်', '1. Choose color 2. Add to cart 3. Pay via transfer 4. Ships in 3-5 days', '၁.အရောင်ရွေး ၂.ကတ်ထဲထည့် ၃.လွှဲငွေ ၄.၃-၅ ရက်ပို့', 1290, 'Fashion', '👜', '🔥 HOT', '#FF2D55', 85),
  ('Premium Lip Gloss Set', 'ပရီမီယံနှုတ်ခမ်းနုနှင်ဆေးစု', 'Set of 6 vibrant colors. Long-lasting & vegan certified.', 'အရောင် ၆ မျိုးစု၊ ကြာရှည်ခံ', 'Apply to lips. Layer for intense color.', 'နှုတ်ခမ်းပေါ် လိမ်းပါ', 320, 'Beauty', '💄', '⚡ NEW', '#FF6B35', 52),
  ('Sport Sneakers Pro 2025', 'ကစားဖိနပ်ပရို ၂၀၂၅', 'Lightweight with memory foam. EU 36-45.', 'မှတ်ဉာဏ်အမြှုပ်ပါ ပေါ့ပါးသော ဖိနပ်', 'Size guide: EU36=23cm / EU38=24.5cm / EU40=26cm', 'EU36=23cm / EU38=24.5cm / EU40=26cm', 2450, 'Fashion', '👟', 'LIMITED', '#6f42c1', 70),
  ('Glow Skin Serum 30ml', 'အသားဖြူဆေးရည် ၃၀မီလီ', 'Vitamin C & Niacinamide. Reduces dark spots in 2 weeks.', 'ဗိုက်တာမင် C ပါ ဆေးရည်၊ ၂ ပတ်အတွင်း အသားဖြူ', 'Apply 2-3 drops morning & night after cleansing.', 'မနက်နှင့် ည ယမ်း ၂-၃ ချက်', 890, 'Beauty', '🌿', '🌱 ORGANIC', '#00C853', 30);
