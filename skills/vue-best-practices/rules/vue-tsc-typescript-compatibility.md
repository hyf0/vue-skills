---
title: vue-tsc and TypeScript Version Compatibility
impact: HIGH
impactDescription: prevents cryptic build failures from version incompatibility
type: capability
tags: vue-tsc, typescript, version, compatibility, build-errors
---

# vue-tsc and TypeScript Version Compatibility

**Impact: HIGH** - prevents cryptic build failures from version incompatibility

vue-tsc has strict version requirements with TypeScript. Mismatched versions cause errors like "Cannot find module 'vue-tsc/out/index'" or vue-tsc silently reporting fewer errors than expected.

## Known Compatibility Matrix

| vue-tsc Version | TypeScript Version | Status |
|-----------------|-------------------|--------|
| 2.1.10+ | ~5.6.2 | Stable |
| 2.1.10 | 5.7.x | Known issues |
| 1.8.22 | 5.0 - 5.5 | Stable (legacy) |

## Symptoms of Incompatibility

- `Cannot find module 'vue-tsc/out/index'`
- vue-tsc reports only 1 error when there should be many
- Build passes locally but fails in CI
- Different errors between team members

## Fix

**Option 1: Pin compatible TypeScript version:**
```json
{
  "devDependencies": {
    "typescript": "~5.6.2",
    "vue-tsc": "^2.1.10"
  }
}
```

**Option 2: Downgrade vue-tsc for TypeScript 5.7+:**
```bash
# If you need TypeScript 5.7+, use stable vue-tsc
npm install -D vue-tsc@1.8.22
```

## Diagnosis

Check your versions:
```bash
npx vue-tsc --version
npx tsc --version
```

Compare with compatibility matrix above.

## When NOT to Apply

- If vue-tsc works correctly and reports expected errors
- If using Volar IDE extension only (not vue-tsc CLI)

## Reference

- [vue-tsc npm](https://www.npmjs.com/package/vue-tsc)
- [vuejs/language-tools#5267](https://github.com/vuejs/language-tools/issues/5267)
