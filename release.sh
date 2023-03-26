#!/bin/bash
set -e
set -o pipefail
npm run build
npm run release
version=$(cat manifest.json | jq -r ".version")
gh release create ${version} -F CHANGELOG.md manifest.json main.js styles.css
git push