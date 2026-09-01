# E-Schools Production Deployment & Server Setup Guide

This document provides a comprehensive step-by-step guide for deploying the **E-Schools (Haula Smart Campus)** platform to a production server (Ubuntu VPS, cPanel, or Local Server).

---

## 1. Prerequisites
- **PHP**: 8.2 or 8.3 with extensions (`pdo`, `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`).
- **Composer**: 2.x
- **Node.js & npm**: Node 18+ & npm 9+
- **Database**: MySQL 8.0+ or PostgreSQL 14+
- **Web Server**: Nginx or Apache with `mod_rewrite` enabled.

---

## 2. Backend Deployment Setup

1. **Clone repository on production server**:
   ```bash
   git clone https://github.com/Sempaicassidy/eschools.git /var/www/eschools
   cd /var/www/eschools/backend
   ```

2. **Install Composer dependencies**:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.production.example .env
   ```
   Edit `.env` and fill in DB credentials, domain details (`APP_URL`), and mail settings:
   ```bash
   php artisan key:generate
   ```

4. **Run Database Migrations & Seeders**:
   ```bash
   php artisan migrate --force
   php artisan db:seed --class=RolePermissionSeeder --force
   php artisan db:seed --class=SuperAdminSeeder --force
   ```

5. **Storage Symlink & File Permissions**:
   ```bash
   php artisan storage:link
   chmod -R 775 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

6. **Optimize Configuration & Cache**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## 3. Client Onboarding (Registering First Client School)

Run the automated artisan onboarding command to set up the client school:

```bash
php artisan school:onboard "Azania Secondary School" "admin@azania.sc.tz" --phone="255712345678" --registration_number="S.0123"
```

This command automatically generates:
- School Profile.
- Administrator Credentials (Email + Default Password).
- Academic Year (Current Year) & Terms.
- NECTA Standard Grading Scales.

---

## 4. Frontend Production Build & Deployment

1. Navigate to the frontend directory:
   ```bash
   cd /var/www/eschools/frontend
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Set up production environment variable:
   Create `.env.production`:
   ```env
   VITE_API_BASE_URL=https://api.eschools.co.tz/api
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

5. Point web server document root to `dist/` directory or serve via Nginx / Apache.

---

## 5. Nginx Server Configuration Example

```nginx
# Backend API (api.eschools.co.tz)
server {
    listen 80;
    server_name api.eschools.co.tz;
    root /var/www/eschools/backend/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}

# Frontend Web Application (app.eschools.co.tz)
server {
    listen 80;
    server_name app.eschools.co.tz;
    root /var/www/eschools/frontend/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 6. SSL Certificate Setup (Let's Encrypt)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.eschools.co.tz -d api.eschools.co.tz
```

---

## 7. Background Tasks & Scheduler (Cron & Supervisor)

1. **Add Laravel Scheduler to Crontab**:
   ```bash
   crontab -e
   ```
   Add:
   ```cron
   * * * * * cd /var/www/eschools/backend && php artisan schedule:run >> /dev/null 2>&1
   ```

2. **Supervisor Queue Worker** (`/etc/supervisor/conf.d/eschools-worker.conf`):
   ```ini
   [program:eschools-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /var/www/eschools/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
   autostart=true
   autorestart=true
   stopasgroup=true
   killasgroup=true
   user=www-data
   numprocs=2
   redirect_stderr=true
   stdout_logfile=/var/www/eschools/backend/storage/logs/worker.log
   stopwaitsecs=3600
   ```
   Run:
   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   sudo supervisorctl start eschools-worker:*
   ```
