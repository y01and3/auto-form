// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig(
  [
    globalIgnores([
      "dist",
      "storybook-static",
      "coverage",
      "*.css",
      "public/*",
      ".DS_Store",
      "node_modules",
      ".yarn",
      ".direnv",
      ".nix-node-bin",
      ".react-router",
      "!.storybook",
      "src/components/ui/*",
    ]),
    ...storybook.configs["flat/recommended"],
    reactHooks.configs.flat.recommended,
    {
      files: ["**/*.{ts,tsx}"],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactRefresh.configs.vite,
        react.configs.flat.recommended,
        importPlugin.flatConfigs.recommended,
        importPlugin.flatConfigs.typescript,
      ],
      plugins: {
        "jsx-a11y": jsxA11y,
        "unused-imports": unusedImports,
      },
      languageOptions: {
        ...jsxA11y.flatConfigs.recommended.languageOptions,
        ecmaVersion: "latest",
        sourceType: "module",
        globals: globals.browser,
      },
      settings: {
        react: {
          version: "detect",
        },
        "import/resolver": {
          typescript: true,
          node: true,
        },
      },
      rules: {
        "no-console": "warn",
        "react/prop-types": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/interactive-supports-focus": "warn",
        "no-unused-vars": "off",
        "unused-imports/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "warn",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            ignoreRestSiblings: false,
            argsIgnorePattern: "^_.*?$",
          },
        ],
        "import/order": [
          "warn",
          {
            groups: [
              "type",
              "builtin",
              "object",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
            ],
            pathGroups: [
              {
                pattern: "~/**",
                group: "external",
                position: "after",
              },
            ],
            alphabetize: {
              order: "asc",
              caseInsensitive: false,
            },
            "newlines-between": "always",
          },
        ],
        "react/self-closing-comp": "warn",
        "react/jsx-sort-props": [
          "warn",
          {
            callbacksLast: true,
            shorthandFirst: true,
            noSortAlphabetically: false,
            reservedFirst: true,
          },
        ],
        "padding-line-between-statements": [
          "warn",
          { blankLine: "always", prev: "*", next: "return" },
          { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
          {
            blankLine: "any",
            prev: ["const", "let", "var"],
            next: ["const", "let", "var"],
          },
        ],
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "react-hooks/exhaustive-deps": "error",
        "@typescript-eslint/ban-ts-comment": "off",
        "no-useless-escape": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/consistent-type-imports": "error",
        "react-refresh/only-export-components": "warn",
        "import/no-unresolved": "off",
      },
    },
  ],
  eslintConfigPrettier,
);
