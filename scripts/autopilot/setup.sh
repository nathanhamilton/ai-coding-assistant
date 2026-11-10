#!/usr/bin/env bash
# One-time Autopilot setup for a GitHub repository. Shows the plan, asks once,
# then applies: labels, CODEOWNERS, repo merge settings, Pages, and branch
# protection with the `autopilot-gate` required check.
#
# Usage: scripts/autopilot/setup.sh [--yes]
set -euo pipefail

cd "$(dirname "$0")/../.."
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
BRANCH=$(jq -r '.defaultBranch' .autopilot/config.json)
OWNER=$(jq -r '.owner' .autopilot/config.json)

if [ -z "$OWNER" ] || [ "$OWNER" = "null" ]; then
  echo "Set \"owner\" (your GitHub username) in .autopilot/config.json first." >&2
  exit 1
fi

cat <<EOF
Autopilot setup for $REPO (default branch: $BRANCH, owner: @$OWNER)

This will:
  1. Create the autopilot:* labels
  2. Generate .github/CODEOWNERS from protectedPaths + riskyPaths (you commit it)
  3. Enable auto-merge, squash merging, and delete-branch-on-merge
  4. Enable GitHub Pages (source: GitHub Actions) for the dashboard
  5. Protect '$BRANCH': require PRs, require the 'autopilot-gate' check,
     require branches up to date, require code-owner review for owned paths,
     dismiss stale approvals. Admins can still bypass in an emergency.

You must also (manually, see .autopilot/README.md → Setup):
  - create a GitHub App, set variable AUTOPILOT_APP_ID and secret AUTOPILOT_APP_PRIVATE_KEY
  - set secret ANTHROPIC_API_KEY (or CLAUDE_CODE_OAUTH_TOKEN)
EOF

if [ "${1:-}" != "--yes" ]; then
  read -r -p "Apply these changes? [y/N] " ok
  [ "$ok" = "y" ] || [ "$ok" = "Y" ] || { echo "Aborted."; exit 1; }
fi

echo "→ Labels"
node scripts/autopilot/cli.mjs labels

echo "→ CODEOWNERS"
node scripts/autopilot/cli.mjs codeowners

echo "→ Merge settings"
gh api -X PATCH "repos/$REPO" \
  -F allow_auto_merge=true -F allow_squash_merge=true -F delete_branch_on_merge=true >/dev/null

echo "→ GitHub Pages"
gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null

echo "→ Branch protection on $BRANCH"
gh api -X PUT "repos/$REPO/branches/$BRANCH/protection" --input - >/dev/null <<JSON
{
  "required_status_checks": { "strict": true, "contexts": ["autopilot-gate"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": false
}
JSON

cat <<EOF

✔ Done. Next:
  1. Commit .github/CODEOWNERS and push.
  2. Add the App + Anthropic secrets (see .autopilot/README.md).
  3. Run: gh workflow run autopilot-dashboard.yml
     Dashboard: https://$(echo "$REPO" | cut -d/ -f1).github.io/$(echo "$REPO" | cut -d/ -f2)/
EOF
