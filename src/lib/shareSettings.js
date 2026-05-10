import { DEFAULT_LEVEL, DEFAULT_MODE, normalizeLevel, normalizeMode } from "./difficultyRules.js";

export function readSettingsFromSearch(search) {
  const params = new URLSearchParams(search);

  return {
    mode: normalizeMode(params.get("mode") ?? DEFAULT_MODE),
    level: normalizeLevel(params.get("level") ?? DEFAULT_LEVEL),
  };
}

export function buildShareUrl(settings, baseUrl = window.location.href) {
  const url = new URL(baseUrl);
  url.searchParams.set("mode", normalizeMode(settings.mode));
  url.searchParams.set("level", normalizeLevel(settings.level));
  return url.toString();
}
