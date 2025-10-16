## Koodecode Admin – Phase 1 Base Setup

Tech: React + TypeScript + Vite, Redux Toolkit, React Router v6, Axios, Tailwind (dark/light), ESLint + Prettier.

### Getting Started
1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.
2. Install deps: `npm install`
3. Start dev server: `npm run dev`

### Structure
```
src/
  api/axios.ts
  components/{Button,Input,Card,Navbar,Sidebar,ThemeToggle}.tsx
  layouts/MainLayout.tsx
  pages/{Dashboard,Users,Problems,Contests,Settings,NotFound}.tsx
  redux/{store.ts}
  redux/slices/{authSlice.ts,themeSlice.ts,uiSlice.ts}
  routes/{AppRoutes.tsx,ProtectedRoute.tsx}
  hooks/{useAuth.ts}
  utils/{storage.ts,roles.ts}
```

### Notes
- Auth is mocked as a logged-in superadmin.
- Theme persists via localStorage (`kc-theme`).
- Axios instance adds Authorization header if token exists; handles 401/403 with a console warning.

### Scripts
- `npm run lint`, `npm run lint:fix`, `npm run format`
# project_koodecode_admin_frontend
