# Serve App Routing Documentation

This document explains the critical routing logic in `src/serve_app.ts` - the core snippet that handles ALL Rhappsody application requests across the platform.

## URL Structure

Rhappsody URLs follow this pattern:
```
https://{ag}.rhapp.app/{an}/{sidecar}/{block}/{other}
```

Where:
- `{ag}` = App Group (subdomain)
- `{an}` = App Name (first path segment)
- `{sidecar}` = Optional sub-route
- `{block}` = Optional sub-parameter
- `{other}` = Additional path segments

## Request Flow (Step-by-Step)

### 1. Initial URL Parsing (Lines 34-36)
```javascript
const url = new URL(request.url);
const ag = url.hostname.split(".")[0];  // Extract app group from subdomain
const [, an, sidecar, block, other] = url.pathname.split("/");
```

### 2. Special System Routes (Lines 39-119)

#### 2.1 Cloudflare Font Optimization Pass-through
- Route: `/{ag}.rhapp.app/cf-fonts/*`
- Action: Pass directly to Cloudflare

#### 2.2 Runtime Local Paths
- `/_/*` → Redirects to `https://rh.rhap.cc/*`
- `/_op/*` → Redirects to `https://op.rhap.cc/*`
- `/_doc/*` → Redirects to `https://doc.rhap.cc/*`

#### 2.3 System-Level Resources
- `/_img/{tag}/{variant}` → Serves images from Supabase storage
- `/_assets/{folder}/{file}` → Serves system assets
- `/rh.ico` → Returns blue favicon
- `/sw.js` → Service worker from app-sidecar
- `/_rhapp.js` → App-specific JavaScript bundle
- `/_ai/*` → AI service proxy

### 3. Special "AN" Names (Lines 125-143)
These reserved app names redirect to sidecar applications:
- `account`, `apps`, `auth`, `claim`, `create`, `dashboard`, `groups`, `images`, `users`, `new`, `signup`, `used`, `visits`
- Routes to: `https://app-sidecar.rhappsody.cloud/{an}/{sidecar}.html`

### 4. Function Calls (Lines 148-204)

#### 4.1 Legacy CFN Calls
- Route: `/fn/{cfnname}`
- Proxies to: `https://cfn-{cfnname}.xpes.workers.dev`
- Adds: `ag`, `shared_secret` parameters

#### 4.2 Rhappsody Actions (RHA)
- Route: `/rha/{actionname}`
- Proxies to: `https://rha-{actionname}.xpes.workers.dev`
- Adds: `ag`, `shared_secret` parameters

### 5. App Context Fetching (Lines 224-243)
```javascript
const appBin = await fetch(`${CTX_BASE}/${ag}/${an}/app.ctx`);
```
- Fetches app context from `https://ctx.rhap.cc/{ag}/{an}/app.ctx`
- Returns 404 if app not found
- Extracts metadata from Content-Type header:
  - `account`, `aid`, `brand`, `color`, `lang`, `name`
  - `sysStatus`, `status`, `version`, `pl`, `reg`, `exp`, `nbf`

### 6. App-Level Sidecars (Lines 248-497)

#### 6.1 Context & Metadata
- `/_ctx` → Returns app context as JSON
- `/icon` → App icon from storage
- `/banner` → App banner image
- `/social` → Social sharing image

#### 6.2 App Resources
- `/rhapp.js` → App JavaScript with CORS headers
- `/img/{imagetag}` → App-specific images from R2

#### 6.3 App-Specific Functions
- `/rha/{actionname}` → App-scoped Rhappsody actions
- `/fn/{cfnname}` → App-scoped cloud functions

#### 6.4 Special Routes
- `/go/{blockname}` → Override start block
- `/as/{role}` → Role-based access
- Various sidecar pages: `is`, `app`, `source`, `data`, `edit`, etc.

### 7. App Status Checks (Lines 503-572)

#### 7.1 System Status
- If `sysStatus !== "0"` → App suspended or over quota

#### 7.2 App Status
- If `status === "1"` → App inactive or password protected

#### 7.3 Preview Mode
- Query param `?preview` → Serves preview page
- Requires plan level >= 10

#### 7.4 Time-Based Access
- `nbf` (not before) → Shows "Live In" countdown
- `exp` (expiry) → Shows expired message

### 8. Final App Rendering (Lines 599-621)
If all checks pass:
```javascript
const html = await renderApp({
  ag, an, aid, reg, pl, color, lang, b64, startBlock, version
});
```
Returns rendered HTML with UTF-8 encoding.

## Security Features

1. **Shared Secret**: `CFN_SHARED_SECRET` validates internal service calls
2. **Plan Checking**: Features like preview require specific plan levels
3. **Status Validation**: Multiple status checks before serving
4. **CORS Headers**: Properly configured for cross-origin requests

## Critical Paths

1. **Normal App Load**: 
   - Parse URL → Fetch context → Check status → Render app

2. **Function Call**: 
   - Parse URL → Proxy to worker → Return response

3. **Static Resource**: 
   - Parse URL → Fetch from storage → Return with headers

## Common Issues & Debugging

1. **404 Errors**: Check if app exists at `ctx.rhap.cc/{ag}/{an}/app.ctx`
2. **Suspended Apps**: Verify `sysStatus` in context
3. **Preview Issues**: Ensure plan level >= 10
4. **CORS Problems**: Check headers in sidecar responses

## ⚠️ CRITICAL WARNINGS

1. **This code serves ALL apps** - Changes affect entire platform
2. **Test thoroughly** - Use staging environment first
3. **Monitor deployments** - Watch error rates after changes
4. **Backward compatibility** - Don't break existing URL patterns
5. **Performance impact** - This runs on EVERY request

---

*Last updated: Based on current serve_app.ts implementation*