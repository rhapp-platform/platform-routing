# platform-routing

⚠️ **CRITICAL PLATFORM COMPONENT** ⚠️

This directory contains the critical routing infrastructure that handles ALL Rhappsody Platform requests, managing how applications are served and routed across the entire platform.

## ⚡ CRITICAL WARNING ⚡

**The `serve_app.ts` snippet is SUPER CRITICAL to platform operation!**

- This file is deployed to Cloudflare Workers and serves ALL Rhappsody applications
- ANY changes here affect EVERY app in the platform
- Changes should be made EXTREMELY CAREFULLY with thorough testing
- Always coordinate with the platform team before modifying
- See `ctx/runtime` documentation for deployment procedures

### Before Making ANY Changes:
1. ✅ Understand the full impact on app delivery
2. ✅ Test thoroughly in development environment
3. ✅ Review with senior team members
4. ✅ Have a rollback plan ready
5. ✅ Monitor closely after deployment

## Directory Structure

- `src/` - TypeScript source files for core functionality
  - [`serve_app.ts`](docs/serve_app.md) - Main application server implementation (see detailed documentation)
  - `renderApp.ts` - Application rendering logic
  - `renderExpired.ts` - Handles expired session rendering
  - `renderLiveIn.ts` - Live preview rendering functionality
  - `renderManifest.ts` - Manifest generation and rendering
  - `genSessionToken.ts` - Session token generation utilities
  - `set_rh_ctx.ts` - Rhappsody context management

## Server Components

Various server implementations for different purposes:
- Application serving (`serve_app.js`)
- API endpoints (`serve_api.js`)
- Image handling (`serve_app_image.js`)
- Data services (`serve_data.js`)
- Manifest handling (`serve_manifest.js`)
- Cross-host services (`serve_xhost.js`)

## Development

This project uses:
- [Bun](https://bun.sh) as the JavaScript/TypeScript runtime
- [Just](https://github.com/casey/just) for task running (see `justfile`)

### Setup

```bash
bun install
```

### Available Commands

Check the `justfile` for available commands and their descriptions.

## Testing

Test files are included for various components:
- `test.ts` - TypeScript tests
- `test.html` - HTML test fixtures
- Various downloaded test files (marked with `_downloaded.js` suffix)

## Legacy Code

The `oldsnippets/` directory contains archived code that may be referenced for historical purposes but should not be used in new development.

