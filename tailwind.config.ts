/** @type {import('tailwindcss').Config} */
import { KeyValuePair, PluginUtils } from "tailwindcss/types/config";
import type { Config } from "tailwindcss";

export default {
  content: ["./**/*.liquid", "./src/**/*.vue"],
  theme: {
    extend: {
      spacing: replace(),
      width: replace(),
      gap: replace(),
      height: replace(),
      margin: replaceMargin(),
      padding: replacePadding(),
      fontSize: {
        base: "16px",
        "2xl": "24px",
      },
    },
  },
  prefix: "t-",
  important: true,
  plugins: [],
} satisfies Config;

function replace(): KeyValuePair<string, string> {
  const spacing = {};
  for (let i = 1; i <= 35; i++) {
    spacing[i] = 4 * i + "px";
  }
  return spacing;
}

function replaceMargin() {
  const margins = {};
  const keys = ["ml", "mt", "mr", "mb", "mx", "my", "m"];

  for (let i = 1; i <= 24; i++) {
    for (const key of keys) {
      margins[`${key}-${i}`] = 4 * i + "px";
    }
  }
  return margins;
}

function replacePadding() {
  const margins = {};
  const keys = ["pl", "pt", "pr", "pb", "px", "py", "p"];

  for (let i = 1; i <= 24; i++) {
    for (const key of keys) {
      margins[`${key}-${i}`] = 4 * i + "px";
    }
  }
  return margins;
}
