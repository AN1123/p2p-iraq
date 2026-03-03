# دليل الإعداد والنشر

## المتطلبات
- Node.js 18+
- pnpm 8+
- PostgreSQL (أو Supabase مجاناً)
- بوت تيليجرام (من @BotFather)

---

## الخطوة 1 — إنشاء بوت تيليجرام

1. افتح @BotFather على تيليجرام
2. `/newbot` → اختر اسم وusername
3. احفظ الـ `BOT_TOKEN`
4. `/setcommands` → ألصق:
```
start - القائمة الرئيسية
buy - شراء USDT
sell - بيع USDT
rates - أسعار اليوم
track - متابعة طلب
help - المساعدة
```

---

## الخطوة 2 — قاعدة البيانات (Supabase مجاناً)

1. اذهب لـ [supabase.com](https://supabase.com) → Create Project
2. انسخ `DATABASE_URL` من Settings → Database → Connection String (URI)
3. استخدمها في ملفات `.env`

---

## الخطوة 3 — نشر API + Bot على Render

1. ادفع الكود لـ GitHub
2. اذهب لـ [render.com](https://render.com) → New → Blueprint
3. اختر الـ repo → سيقرأ `render.yaml` تلقائياً
4. أضف المتغيرات المطلوبة:
   - `BOT_TOKEN` — من BotFather
   - `ADMIN_GROUP_ID` — ID مجموعة المشرفين (سالب: -100xxxxxx)
   - `ADMIN_IDS` — Telegram IDs المشرفين مفصولة بفاصلة
   - `FRONTEND_URL` — رابط الموقع بعد النشر
   - `BOT_USERNAME` — username البوت
   - `ESCROW_WALLET_TRC20` — عنوان محفظة TRC20
   - `ESCROW_WALLET_ERC20` — عنوان محفظة ERC20
   - `ESCROW_WALLET_BEP20` — عنوان محفظة BEP20

---

## الخطوة 4 — تشغيل DB Migration

بعد نشر API على Render:
```bash
# في Render Shell أو locally مع DATABASE_URL الصحيح
cd apps/api
npx prisma migrate deploy
npx prisma db seed  # إضافة أسعار ابتدائية
```

---

## الخطوة 5 — نشر الموقع على Vercel

1. اذهب لـ [vercel.com](https://vercel.com) → Import Repository
2. اختر `AN1123/p2p-iraq`
3. **Root Directory**: `apps/web`
4. أضف متغيرات البيئة:
   - `NEXT_PUBLIC_API_URL` = رابط API على Render
   - `NEXT_PUBLIC_BOT_USERNAME` = username البوت
   - `NEXT_PUBLIC_SITE_NAME` = اسم الموقع
5. Deploy!

---

## الخطوة 6 — تعيين السعر الأولي

بعد نشر كل شيء، أرسل للبوت (كمشرف):
1. `/admin` → تحديث السعر
2. أدخل: `1485/1465`

---

## متغيرات البيئة الكاملة

### apps/api/.env
```
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
BOT_TOKEN=...
BOT_USERNAME=YourBot
ADMIN_GROUP_ID=-100xxxxxxx
ADMIN_SECRET=random_secret_here
FRONTEND_URL=https://your-site.vercel.app
ESCROW_WALLET_TRC20=TXxxxxxxxxxx
ESCROW_WALLET_ERC20=0xxxxxxxxxxx
ESCROW_WALLET_BEP20=0xxxxxxxxxxx
```

### apps/bot/.env
```
BOT_TOKEN=...
BOT_USERNAME=YourBot
API_URL=https://your-api.render.com
API_SECRET=random_secret_here
ADMIN_GROUP_ID=-100xxxxxxx
ADMIN_IDS=123456789,987654321
ESCROW_WALLET_TRC20=TXxxxxxxxxxx
ESCROW_WALLET_ERC20=0xxxxxxxxxxx
ESCROW_WALLET_BEP20=0xxxxxxxxxxx
```

### apps/web/.env.local
```
NEXT_PUBLIC_API_URL=https://your-api.render.com
NEXT_PUBLIC_BOT_USERNAME=YourBot
NEXT_PUBLIC_SITE_NAME=USDT Iraq
```

---

## الحصول على ADMIN_GROUP_ID

1. أضف @userinfobot لمجموعة المشرفين
2. أرسل أي رسالة → سيعطيك الـ ID (سيكون سالباً مثل -1001234567890)
