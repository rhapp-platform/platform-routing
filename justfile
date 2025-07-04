# Show all available recipes
default:
    @just --list --list-prefix ' • '

# Show the source code of a recipe
show recipe:
    @just --show {{ recipe }}

# ═══════════════════════════════════════════════════════════════════════════════════
# Build Commands
# ═══════════════════════════════════════════════════════════════════════════════════

# Build a TypeScript file from src directory (minified)
alias b := build
build name:
    @if [ "{{name}}" = "serve_app" ]; then \
        echo "Generating manifest template..."; \
        bun run scripts/generate-manifest.ts; \
    fi
    bun build src/{{name}}.ts --minify --outfile={{name}}.js

# Build serve_app.ts (the critical platform routing component)
build-serve-app:
    just build serve_app

# Build all TypeScript files in src directory
build-all:
    #!/usr/bin/env bash
    for file in src/*.ts; do
        if [ -f "$file" ]; then
            name=$(basename "$file" .ts)
            echo "Building $name..."
            just build "$name"
        fi
    done

# ═══════════════════════════════════════════════════════════════════════════════════
# Deployment Commands
# ═══════════════════════════════════════════════════════════════════════════════════

# Deploy snippets to Cloudflare (requires configuration)
alias d := deploy
deploy snippets:
    echo "Deploy snippets to Cloudflare"
    echo "TODO: Implement deployment logic"

# List all Cloudflare snippets for the zone
list-snippets:
    #!/usr/bin/env bash
    # Note: These should be environment variables or in a .env file
    ZONE_ID="${CLOUDFLARE_ZONE_ID:-d9b23864005da27cf9a519ba2f428203}"
    API_TOKEN="${CLOUDFLARE_API_TOKEN:-nBBt7RK2x69I8p5J06s5Hz_AdluPwIqAH_FdqNeK}"
    EMAIL="${CLOUDFLARE_EMAIL:-glenn@rhappsody.com}"
    
    curl --request GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/snippets" \
        --header "Authorization: Bearer ${API_TOKEN}" \
        -H "X-Auth-Email: ${EMAIL}" | jq

# ═══════════════════════════════════════════════════════════════════════════════════
# Testing Commands
# ═══════════════════════════════════════════════════════════════════════════════════

# Test an app endpoint with curl
test-app ag an:
    curl -i "https://{{ag}}.rhapp.app/{{an}}"

# Test an app from Supabase storage bucket
test-app-sbs ag an:
    curl -i "https://sb.rhap.cc/storage/v1/object/public/apps/{{ag}}/{{an}}/app.rha?ffffeeee"

# Upload a test file to Supabase bucket with proper headers
upload-test ag an file:
    rclone copyto {{file}} "sbs:/apps/{{ag}}/{{an}}/{{file}}" \
        --header-upload "Content-Type: application/x-rha-aidvalue-{{ag}}-{{an}}"

# ═══════════════════════════════════════════════════════════════════════════════════
# Version & Release Commands
# ═══════════════════════════════════════════════════════════════════════════════════

# Show current version
version:
    @jq -r '.version' package.json 2>/dev/null || echo "No package.json found"

# ═══════════════════════════════════════════════════════════════════════════════════
# Git Commands
# ═══════════════════════════════════════════════════════════════════════════════════

# Stage all changes, commit with message, and push to main
alias g := gitp
gitp message="update":
    git add .
    git commit -m "{{message}}"
    git push origin main