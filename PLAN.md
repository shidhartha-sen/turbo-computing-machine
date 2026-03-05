# Auth: Outlook/Microsoft OAuth Login

## Overview
Replace the custom JWT credential system with Microsoft (Outlook) OAuth only.
- **Frontend**: expo-auth-session opens a browser → Microsoft OAuth → returns access token
- **Token storage**: expo-secure-store
- **Backend**: verifies token via Microsoft Graph API, creates/finds user in neon_auth.user, returns user info
- **No passwords stored anywhere**

---

## Pre-requisite (user must do once)
Register an Azure App:
1. Go to https://portal.azure.com → Azure Active Directory → App registrations → New
2. Set redirect URI to your Expo scheme (e.g. `exp://` for Expo Go or `flipurt://` for production)
3. Note down: **Client ID** and **Tenant ID** (use `common` for any Microsoft account)
4. Add to `frontend/.env.local`:
   ```
   EXPO_PUBLIC_MS_CLIENT_ID=<your-client-id>
   EXPO_PUBLIC_MS_TENANT_ID=common
   ```

---

## Files Changed

### New
| File | Purpose |
|------|---------|
| `frontend/context/AuthContext.tsx` | Global auth state, login/logout, SecureStore |
| `frontend/app/login.tsx` | Login screen with "Sign in with Microsoft" button |

### Modified
| File | Change |
|------|--------|
| `frontend/app/_layout.tsx` | Wrap in AuthProvider, add login screen, redirect logic |
| `frontend/services/api.ts` | Add `loginWithMicrosoft()`, inject Bearer token in all requests |
| `backend/app/api/v1/routes/auth.py` | Add `/auth/microsoft` endpoint, verify via Graph API |
| `backend/app/core/config.py` | Remove JWT fields, add optional MS_TENANT_ID |
| `backend/app/main.py` | No change needed |

---

## Implementation Steps

### Step 1 — Install dependencies
```bash
# Frontend
cd frontend && npx expo install expo-auth-session expo-secure-store expo-crypto

# Backend
cd backend && pip install httpx
```

### Step 2 — Backend: `/api/v1/auth/microsoft`
- POST `{ access_token: string }`
- Call `GET https://graph.microsoft.com/v1.0/me` with the token
- Get `id`, `displayName`, `mail`/`userPrincipalName`
- Find or create user in `neon_auth."user"` by email
- If new, also insert into `public.users`
- Return `{ user_id, name, email }`

### Step 3 — Backend: update `get_current_user_id`
- Verify Microsoft token by calling Graph API `/me` with each request
- Cache token → user_id in-process dict with TTL to reduce Graph API calls

### Step 4 — `AuthContext.tsx`
- `login()`: use expo-auth-session to start Microsoft OAuth, POST token to `/auth/microsoft`, store token in SecureStore
- `logout()`: clear SecureStore and state
- On mount: restore token from SecureStore, validate with backend `/auth/me`

### Step 5 — `app/login.tsx`
- Single "Sign in with Microsoft" button (Microsoft blue `#0078D4`)
- Loading spinner during OAuth flow
- Error message on failure

### Step 6 — `_layout.tsx` routing guard
- `<AuthProvider>` wraps Stack
- `useEffect` watches auth state → redirect to `/login` if unauthenticated
- Redirect to `/(tabs)` if authenticated and on login screen

### Step 7 — `services/api.ts`
- `setAuthToken(token)` — called by AuthContext after login/logout
- All fetch requests include `Authorization: Bearer ${token}`
- New function: `loginWithMicrosoft(msToken)` → POST `/api/v1/auth/microsoft`

---

## Verification
1. Backend running: `uvicorn app.main:app --reload`
2. Frontend running: `npx expo start`
3. App opens on login screen (unauthenticated)
4. Tap "Sign in with Microsoft" → browser opens → sign in with Outlook account
5. Returns to app → home tab loads
6. Kill and reopen → still logged in
7. Log out from profile tab → back to login
