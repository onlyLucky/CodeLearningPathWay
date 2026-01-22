import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configTypeScript from '@typescript-eslint/parser'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: configTypeScript
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        getComputedStyle: 'readonly'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: configTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        getComputedStyle: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': 'off',
      'no-debugger': 'off'
    }
  }
]
