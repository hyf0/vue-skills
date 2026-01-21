---
title: Fix Slow Save Times with Code Actions Setting
impact: HIGH
impactDescription: fixes 30-60 second save delays in large Vue projects
type: capability
tags: performance, save-time, vscode, code-actions, volar
---

# Fix Slow Save Times with Code Actions Setting

**Impact: HIGH** - fixes 30-60 second save delays in large Vue projects

In large Vue projects, saving files can take 30-60+ seconds due to VSCode's code actions triggering expensive TypeScript state synchronization.

## Problem

Symptoms:
- Save operation takes 30+ seconds
- Editor becomes unresponsive during save
- CPU spikes when saving Vue files
- Happens more in larger projects

## Root Cause

VSCode emits document change events multiple times during save cycles. Each event triggers Volar to synchronize with TypeScript, causing expensive re-computation.

## Solution

Disable code actions or limit their timeout:

**Option 1: Disable code actions (fastest)**
```json
// .vscode/settings.json
{
  "vue.codeActions.enabled": false
}
```

**Option 2: Limit code action time**
```json
// .vscode/settings.json
{
  "vue.codeActions.savingTimeLimit": 1000
}
```

**Option 3: Disable specific code actions**
```json
// .vscode/settings.json
{
  "vue.codeActions.enabled": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "never"
  }
}
```

## VSCode Version Requirement

VSCode 1.81.0+ includes fixes that reduce save time issues. Upgrade if using an older version.

## Additional Optimizations

```json
// .vscode/settings.json
{
  "vue.codeActions.enabled": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {},
  "[vue]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "Vue.volar"
  }
}
```

## Reference

- [Vue Language Tools Discussion #2740](https://github.com/vuejs/language-tools/discussions/2740)
