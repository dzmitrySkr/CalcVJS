import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig({
  files: ["**/*.js"],
  languageOptions: {
    globals: globals.browser,
    ecmaVersion: 2025,
    sourceType: "module"
  },
  rules: {
    "semi": ["error", "always"],          // обязательные точки с запятой
    "quotes": ["error", "double"],        // двойные кавычки
    "no-unused-vars": ["warn"],           // предупреждение о неиспользуемых переменных
  }
});