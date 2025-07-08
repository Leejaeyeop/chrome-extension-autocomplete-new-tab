// eslint.config.js
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser,
            ecmaVersion: 2020,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": plugin,
            prettier,
        },
        rules: {
            ...plugin.configs.recommended.rules,
            ...prettier.configs.recommended.rules,
        },
    },
    {
        files: ["**/*.js"],
        rules: {
            "@typescript-eslint/no-var-requires": "off",
        },
    },
];
