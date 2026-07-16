import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Static export ships plain <img> site-wide; next/image optimization is
      // unavailable on Netlify static hosting, so the warning is pure noise.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      // Google Apps Script code: V8 runtime with GAS globals, not part of the app bundle
      'apps-script/**',
    ],
  },
]

export default eslintConfig
