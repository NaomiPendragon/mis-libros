# Mis libros — calentamiento

Pila de libros pendientes por usuario. Sirve para probar el flujo completo antes de Nilibro:
Supabase (Auth + BD con RLS) → React (Vite) → GitHub → Vercel.

## 1. Supabase

1. **SQL Editor → New query**: pega `supabase/schema.sql` y dale **Run**.
2. **Authentication → Sign In / Providers → Email**: desactiva **Confirm email** (el plan gratis manda muy pocos correos por hora).
3. **Project Settings → API**: copia la **Project URL** y la llave **anon public**.
   La `service_role` no se usa ni se comparte nunca.

## 2. Local

```bash
cp .env.example .env    # y llena las dos variables
npm install
npm run dev             # abre http://localhost:5173
```

## 3. GitHub + Vercel

1. Crea un repo vacío en GitHub y sube el proyecto (el `.env` no se sube, está en `.gitignore`).
2. En Vercel: **Add New → Project** → importa el repo. Vercel detecta Vite solo.
3. En **Environment Variables** agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` → **Deploy**.
4. De vuelta en Supabase, **Authentication → URL Configuration**: pon la URL de Vercel en **Site URL**.

## Qué se está probando

| Pieza | Dónde |
|---|---|
| Registro / login / logout | `src/Auth.jsx`, `src/App.jsx` |
| CRUD (crear, listar, editar, borrar) | `src/Pendientes.jsx` |
| Cada usuario solo ve lo suyo (RLS) | `supabase/schema.sql` |
| Cabeceras de seguridad (para OWASP ZAP) | `vercel.json` |
