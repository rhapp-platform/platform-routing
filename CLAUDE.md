# CLAUDE.md - Platform Routing

This file provides guidance to Claude Code (claude.ai/code) when working with the platform-routing repository.

## 🚨 CRITICAL: This is Core Platform Infrastructure

**WARNING**: This repository contains the routing infrastructure that handles ALL requests for the Rhappsody platform. Every single app request flows through this code. Changes here affect the ENTIRE platform.

## Repository Overview

This is the Cloudflare Workers-based routing system that:
- Handles all incoming requests to `*.rhapp.app` domains
- Routes requests to appropriate services and resources
- Manages application context, authentication, and authorization
- Serves static assets, images, and application bundles
- Provides integration with various platform services

## Key Files to Understand

### Critical Core Files
- `src/serve_app.ts` - **SUPER CRITICAL**: Main app serving logic that handles ALL platform requests
- `src/renderApp2.ts` - Application rendering logic
- `src/set_rh_ctx.ts` - Rhappsody context management

### Supporting Components
- `src/serve_api.js` - API endpoint handling
- `src/serve_app_image.js` - Image serving
- `src/serve_data.js` - Data service endpoints
- `src/serve_manifest.js` - App manifest handling
- `src/serve_xhost.js` - Cross-host services

## Development Guidelines

### Before Making ANY Changes

1. **Understand the Impact**: This code runs on EVERY platform request
2. **Test Thoroughly**: Use the justfile commands to test in development
3. **Consider Performance**: This is in the critical path for all apps
4. **Maintain Compatibility**: Don't break existing URL patterns
5. **Check Dependencies**: Understand what services this integrates with

### Common Development Commands

```bash
# Build specific target
just build <name>

# Build all targets
just build-all

# Test an app endpoint
just test-app <app-group> <app-name>

# View available commands
just
```

## Architecture Flow

1. **Request arrives** at Cloudflare Worker
2. **URL parsing** extracts app group, app name, and path
3. **Special routes** checked (fonts, runtime, assets, etc.)
4. **App context** fetched from ctx.rhap.cc
5. **Status checks** performed (live, expired, permissions)
6. **Route handling** based on path (sidecar, images, functions, etc.)
7. **Response generation** (app render, asset serve, or error)

## External Services

This router integrates with:
- **Context Service** (`ctx.rhap.cc`) - App metadata
- **Supabase** (`sb.rhap.cc`) - Asset storage
- **Runtime Services** (`rh.rhap.cc`, `op.rhap.cc`)
- **AI Service** (`ai.rhap.cc`)
- **Worker Functions** (`cfn-*.xpes.workers.dev`)
- **Sidecar Apps** (`app-sidecar.rhappsody.cloud`)

## Critical Warnings

⚠️ **Platform-wide Impact**: Any bug here affects EVERY app
⚠️ **Performance Critical**: This is the hot path for all requests
⚠️ **Security Sensitive**: Handles authentication and authorization
⚠️ **Backward Compatibility**: Must maintain existing URL patterns

## Testing Strategy

1. **Local Testing**: Use justfile commands to test endpoints
2. **Development Environment**: Test on dev workers before production
3. **Monitor After Deploy**: Watch error rates and performance metrics
4. **Rollback Plan**: Always have a quick rollback strategy

## Common Patterns

### Adding a New Route
1. Check if it's a special system route (add to early checks in serve_app.ts)
2. Consider if it's app-group level or app-specific
3. Add appropriate access control checks
4. Test with multiple app configurations

### Debugging Issues
1. Check the request flow in serve_app.ts
2. Verify external service responses (ctx, storage, etc.)
3. Check for missing await statements (common async bug)
4. Use console.log sparingly (performance impact)

## Deployment Notes

- Deployed via Cloudflare Workers
- Build outputs go to `dist/` directory
- Deployment managed through separate repository (`ctx/runtime`)
- Uses wrangler for Cloudflare deployment

## Remember

This is the beating heart of the Rhappsody platform. Every millisecond counts, every bug affects everyone, and stability is paramount. When in doubt, ask for review from the platform team.