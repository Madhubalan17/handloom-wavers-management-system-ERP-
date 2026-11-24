# HWMS Django Backend & PostgreSQL Database

Handloom Weaver Management System (HWMS) RESTful API backend built with **Python 3**, **Django 5**, and **Django REST Framework**.

---

## 🗄️ Database Configuration (PostgreSQL)

Configured as requested:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hwms',
        'USER': 'postgres',
        'PASSWORD': 'your_postgres_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### PostgreSQL Setup Instructions:
1. Open PostgreSQL command line (`psql`) or pgAdmin:
   ```sql
   CREATE DATABASE hwms;
   ```
2. Open `backend/.env` and update your PostgreSQL password:
   ```env
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=hwms
   DB_USER=postgres
   DB_PASSWORD=your_real_password_here
   DB_HOST=localhost
   DB_PORT=5432
   ```
3. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python manage.py seed_data
   ```

*(Note: If PostgreSQL password is not yet configured or PostgreSQL service is offline, Django automatically uses local SQLite development storage so the app never crashes!)*

---

## 🚀 Running the Backend Server

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```
- API Base URL: `http://localhost:8000/api/`
- Django Admin Portal: `http://localhost:8000/admin/`

---

## 📡 REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login/` | `POST` | Authenticates Admin, Manager, Staff, Storekeeper, Weaver |
| `/api/users/` | `GET, POST` | Admin management of all 5 user login accounts |
| `/api/users/<id>/` | `PATCH, DELETE` | Update password, toggle status, delete user account |
| `/api/weavers/` | `GET, POST` | List artisans (filters: `search`, `village`, `status`), onboard new weaver |
| `/api/weavers/<id>/`| `GET, PUT, DELETE`| Get profile, edit artisan details, delete record |
| `/api/looms/` | `GET, POST` | Loom infrastructure inventory (L-001 to L-005) |
| `/api/stock/` | `GET, POST` | Raw material yarn stock weights (Cotton, Silk, Polyester) |
| `/api/production/` | `GET, POST` | Daily weaving meters logged |
| `/api/salaries/` | `GET, POST` | Weaver piece-rate wage records and payment slips |
| `/api/dashboard/stats/` | `GET` | Aggregated KPI stats for the Executive Dashboard |
