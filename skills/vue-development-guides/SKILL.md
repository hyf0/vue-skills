---
name: vue-development-guides
description: A collection of best practices and tips for developing applications using Vue.js. This skill MUST be apply when developing, refactoring or reviewing Vue.js or Nuxt projects.
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: "17.0.0"
compatibility: Requires Vue 3 (or above) or Nuxt 3 (or above) project
---

# Vue.js Development Guides

## Tasks Checklist

- [ ] Followed the component best practices
  - [ ] Followed the Vue SFC best practices
  - [ ] Kept components focused
    - [ ] Split large components into smaller ones when needed
    - [ ] Moved state/side effects into composables if applicable
  - [ ] Followed data flow best practices

---

### Data Flow

For sharing data across the app, please follow the `references/state-management-guide.md` and consider using a Store for state management solution.
