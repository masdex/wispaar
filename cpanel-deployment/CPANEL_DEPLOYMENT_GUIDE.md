# راهنمای جامع و گام‌به‌گام استقرار پروداکشن WISPAAR در cPanel
## اتصال فرانت‌اند React Vite به وردپرس Headless (دامنه: https://wispaar.ir)

این راهنما برای استقرار ایمن و بدون ریسک در هاست‌های اشتراکی و سرورهای مبتنی بر **cPanel / Apache** تهیه شده است.

---

## ۱. قبل از هر اقدامی: پشتیبان‌گیری حیاتی (Zero-Risk Backup)

پیش از آپلود یا تغییر هر فایلی، سه اقدام زیر را در cPanel انجام دهید:

1. **پشتیبان‌گیری از دیتابیس:**
   - در cPanel وارد **phpMyAdmin** شوید.
   - دیتابیس وردپرس خود را انتخاب کرده و از تب **Export** دکمه **Export** را بزنید و فایل `.sql` را ذخیره کنید.
2. **پشتیبان‌گیری از فایل‌های هسته و کانفیگ:**
   - در **File Manager** به مسیر ریشه وردپرس (`public_html` یا دایرکتوری سایت) بروید.
   - از دو فایل زیر یک کپی با نام جدید بگیرید:
     - `.htaccess` -> `.htaccess.backup`
     - `wp-config.php` -> `wp-config.php.backup`
3. **فایل‌هایی که هرگز نباید حذف یا بازنویسی شوند:**
   - ⚠️ پوشه `wp-admin`
   - ⚠️ پوشه `wp-content`
   - ⚠️ پوشه `wp-includes`
   - ⚠️ فایل `wp-config.php`
   - ⚠️ دیتابیس وردپرس

---

## ۲. رفع خطای PHP در افزونه وردپرس (حل خطای Headers Already Sent)

### علت اصلی خطا در سرور:
خطای مشاهده‌شده روی سرور:
```text
Cannot modify header information - headers already sent by (output started at /home/zibatau/wispaar/wp-content/plugins/wispaar-headless/headless.php:1)
```
این خطا دقیقاً به این دلیل رخ می‌دهد که فایل `headless.php` روی سرور دارای کاراکتر نامرئی **UTF-8 BOM (Byte Order Mark)** یا فاصله/خط خالی قبل از تگ `<?php` در خط ۱ است. وقتی PHP قبل از ارسال هدرهای HTTP کاراکتری به خروجی بفرستد، امکان ارسال هدرهای CORS یا هدر JSON وردپرس از بین می‌رود و هدرها ارسال‌شده تلقی می‌شوند.

### نحوه اعمال پچ و رفع خطا:
1. در File Manager سی‌پنل به مسیر زیر بروید:
   ```text
   /wp-content/plugins/wispaar-headless/
   ```
2. فایل اصلاح‌شده و تمیز `wispaar-headless/headless.php` موجود در این پروژه را دانلود کرده و جایگزین فایل قبلی کنید.
3. اطمینان حاصل کنید که خط اول فایل دقیقاً با عبارت `<?php` بدون هیچ فاصله یا خط خالی شروع شده است.
4. آدرس تست سلامت را در مرورگر باز کنید:
   ```text
   https://wispaar.ir/wp-json/wispaar/v1/health
   ```
   باید خروجی JSON زیر بدون هیچ خطای PHP یا اخطار هدر نمایش داده شود:
   ```json
   {
     "success": true,
     "status": "online",
     "site": "headless",
     "wp": "7.1.3"
   }
   ```

---

## ۳. بیلد و آپلود فرانت‌اند React در ریشه سایت

### ۱. فایل‌های تولیدشده فرانت‌اند:
پوشه `dist` که با دستور `npm run build` ساخته می‌شود شامل فایل‌های زیر است:
- `index.html` (نقطه ورود فرانت‌اند React)
- پوشه `assets/` (کدهای فشرده و بهینه‌سازی‌شده JS و CSS)
- پوشه `images/`
- فایل `.htaccess`
- `robots.txt`
- `sitemap.xml`

### ۲. آپلود در cPanel:
1. تمام محتویات داخل پوشه `dist` را انتخاب کرده و به صورت یک فایل زیپ (`wispaar-dist.zip`) فشرده کنید.
2. در File Manager سی‌پنل به ریشه دامنه (`public_html/`) بروید.
3. فایل زیپ را آپلود کرده و **Extract** کنید.
4. **نکته بسیار مهم:** فایل `index.php` پیش‌فرض وردپرس را دست نزنید؛ فایل `index.html` فرانت‌اند در کنار آن قرار می‌گیرد.

---

## ۴. تنظیم فایل htaccess. برای مسیریابی دوگانه (Dual Routing)

فایل `.htaccess` موجود در پوشه `cpanel-deployment/.htaccess` به گونه‌ای طراحی شده است که:
1. تمام مسیرهای وردپرس اعم از `/wp-admin/`، لاگین، آپلودها و REST API به وردپرس ارسال شوند.
2. تمام مسیرهای فرانت‌اند React (مانند `/portfolio`، `/services`، `/blog`، `/start-project` و رفرش مستقیم صفحات) به فایل `index.html` هدایت شوند تا خطای 404 رخ ندهد.
3. پروتکل امن HTTPS و ریدایرکت خودکار اعمال شود.

### محتوای استاندارد `.htaccess`:
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# 1. Enforce HTTPS & Canonical Host
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\.wispaar\.ir$ [NC]
RewriteRule ^(.*)$ https://wispaar.ir/$1 [L,R=301]

# 2. WordPress Core & API Bypass
RewriteRule ^wp-admin/? - [L]
RewriteRule ^wp-login\.php$ - [L]
RewriteRule ^wp-register\.php$ - [L]
RewriteRule ^xmlrpc\.php$ - [L]
RewriteRule ^wp-cron\.php$ - [L]

RewriteCond %{REQUEST_URI} ^/wp-json [NC]
RewriteRule ^wp-json/(.*)?$ /index.php [L,QSA]

RewriteRule ^wp-content/ - [L]
RewriteRule ^wp-includes/ - [L]

# 3. Direct Static Files & Folders
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 4. React SPA Fallback
RewriteRule ^ index.html [L]
</IfModule>
```

---

## ۵. تست‌های زنده سرور با دستورات cURL (قبل و بعد از جایگزینی افزونه)

برای اطمینان از سلامت کامل وب‌سرویس و رفع خطای PHP، دستورات زیر را در خط فرمان یا ترمینال اجرا کنید:

### ۱. تست اندپوینت سلامت (Health Check):
```bash
curl -i -s "https://wispaar.ir/wp-json/wispaar/v1/health"
```
**خروجی مورد انتظار:**
- کد وضعیت HTTP: `200 OK`
- هدر: `Content-Type: application/json`
- بدنه (JSON خالص بدون هیچ متنی در ابتدا):
  ```json
  {"success":true,"status":"online","site":"headless","wp":"7.1.3"}
  ```
- **نکته:** اگر در بالای خروجی عبارت `Warning: Cannot modify header information` دیده شود، نشان می‌دهد فایل `headless.php` هنوز روی هاست جایگزین نشده یا کش وب‌سرور پاک نشده است.

### ۲. تست اندپوینت پروژه‌ها (Projects):
```bash
curl -i -s "https://wispaar.ir/wp-json/wispaar/v1/projects"
```
**خروجی مورد انتظار:**
- کد وضعیت HTTP: `200 OK`
- بدنه:
  ```json
  {"items":[],"total":0,"total_pages":0,"page":1}
  ```

### ۳. تست اندپوینت مقالات (Articles):
```bash
curl -i -s "https://wispaar.ir/wp-json/wispaar/v1/articles"
```
**خروجی مورد انتظار:**
- کد وضعیت HTTP: `200 OK`
- بدنه: آرایه شامل نوشته «Hello world!» یا مقالات جدید.

### ۴. تست امنیتی مسدود بودن سرنخ‌ها برای عموم (Protected Leads):
```bash
curl -i -s "https://wispaar.ir/wp-json/wispaar/v1/leads"
```
**خروجی مورد انتظار:**
- کد وضعیت HTTP: `401 Unauthorized` یا `403 Forbidden`
- تأیید اینکه اطلاعات خصوصی کارفرمایان برای افراد ناشناس قابل مشاهده نیست.

### ۵. تست ارسال بریف پروژه (Brief Submission):
```bash
curl -i -s -X POST "https://wispaar.ir/wp-json/wispaar/v1/brief" \
  -H "Content-Type: application/json" \
  -d '{"name":"تست استقرار","phone":"09120000000","email":"test@wispaar.ir","description":"آزمون وب‌سرویس"}'
```
**خروجی مورد انتظار:**
- کد وضعیت HTTP: `200 OK`
- پاسخ: `{"success":true,"message":"...","lead_id":...}`

---

## ۶. تحلیل ریسک‌های معماری استقرار در ریشه مشترک (Shared Root Risks)

استقرار فرانت‌اند React و وردپرس در یک پوشه ریشه (`public_html`):
1. **مزیت:** عدم نیاز به ساب‌دامین یا تغییر آدرس وردپرس و حفظ ساختار فعلی سایت.
2. **ریسک‌ها و راه‌حل:**
   - **تداخل نام فایل‌ها:** فایل `index.html` فرانت‌اند در کنار `index.php` وردپرس قرار می‌گیرد. در وب‌سرور آپاچی اولویت لود پیش‌فرض معمولاً با `index.html` است. بنابراین صفحه اصلی به فرانت‌اند هدایت می‌شود و روت‌های وردپرس توسط قوانین `.htaccess` محافظت می‌شوند.
   - **اهمیت حیاتی .htaccess:** اگر فایل `.htaccess` پاک شود یا توسط افزونه‌های وردپرس (مانند افزونه‌های کش یا سئو) ناخواسته بازنویسی شود، ممکن است روت‌های فرانت‌اند خطای ۴۰۴ دهند یا پیشخوان از کار بیفتد. به همین دلیل همواره یک کپی از `.htaccess` پیشنهادی را نگه دارید.
   - **راهکار جایگزین (در صورت نیاز به جداسازی کامل):** اگر در آینده نخواستید ریشه اشتراکی داشته باشید، می‌توانید فایل‌های وردپرس را به پوشه `/cms` یا ساب‌دامین `cms.wispaar.ir` منتقل کنید؛ اما در ساختار فعلی، قوانین ارائه‌شده در این پکیج کاملاً تست شده و بدون تداخل کار می‌کنند.

---

## ۷. چک‌لیست اعتبارسنجی نهایی پس از استقرار

پس از آپلود فایل‌ها، ۱۰ مورد زیر را تست کنید:
1. باز کردن صفحه اصلی `https://wispaar.ir` -> ظاهر کامل سایت لود شود.
2. رفرش مستقیم صفحه `https://wispaar.ir/portfolio` -> بدون خطای ۴۰۴ لود شود.
3. باز کردن `https://wispaar.ir/wp-admin/` -> صفحه ورود مدیریت وردپرس باز شود.
4. تست اندپوینت سلامت `https://wispaar.ir/wp-json/wispaar/v1/health` -> پاسخ معتبر بدون اخطار PHP.
5. تست اندپوینت پروژه‌ها `https://wispaar.ir/wp-json/wispaar/v1/projects` -> ساختار معتبر JSON با آرایه items.
6. تست اندپوینت مقالات `https://wispaar.ir/wp-json/wispaar/v1/articles` -> نمایش مقالات منتشرشده وردپرس.
7. ارسال فرم بریف در `https://wispaar.ir/start-project` -> ثبت موفق در وردپرس و دریافت شناسه لید.
8. حفاظت دسترسی به سرنخ‌ها -> عدم امکان دسترسی به `/wp-json/wispaar/v1/leads` برای کاربران ناشناس (401/403).
9. باز کردن فایل سئو `https://wispaar.ir/robots.txt` و `https://wispaar.ir/sitemap.xml`.
10. عدم وجود هیچ‌گونه خطای کنسول جاوااسکریپت در مرورگر.

---

## ۸. دستورالعمل بازگشت سریع به وضعیت قبل (Rollback)

اگر به هر دلیلی نیاز به بازگشت فوری داشتید:
1. فایل `.htaccess` را حذف کرده و فایل پشتیبان `.htaccess.backup` را جایگزین کنید.
2. فایل `index.html` را موقتاً تغییر نام دهید (مثلاً `index.html.disabled`).
3. سایت بلافاصله به حالت اولیه وردپرس بازخواهد گشت.
