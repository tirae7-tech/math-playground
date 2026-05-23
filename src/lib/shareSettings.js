import {
  DEFAULT_GRADE,
  DEFAULT_MODE,
  DEFAULT_TIER,
  normalizeGrade,
  normalizeModeForGrade,
  normalizeTier,
} from "./gradeRules.js";

const LEGACY_LEVEL_MAP = {
  easy: "low",
  normal: "middle",
  challenge: "high",
};

const SHARE_MODE_IDS = [
  "arithmetic",
  "fraction",
  "decimal",
  "mix",
  "add",
  "subtract",
  "multiply",
  "divide",
];
const LEGACY_ARITHMETIC_MODES = ["add", "subtract", "multiply", "divide"];

function normalizeShareMode(mode, grade) {
  if (!SHARE_MODE_IDS.includes(mode)) {
    return DEFAULT_MODE;
  }

  const nextMode = LEGACY_ARITHMETIC_MODES.includes(mode) ? "arithmetic" : mode;

  return normalizeModeForGrade(nextMode, grade);
}

export function readSettingsFromSearch(search) {
  const params = new URLSearchParams(search);
  const legacyLevel = LEGACY_LEVEL_MAP[params.get("level")];
  const grade = normalizeGrade(params.get("grade") ?? DEFAULT_GRADE);
  const tier = normalizeTier(params.get("tier") ?? legacyLevel ?? DEFAULT_TIER);
  const mode = normalizeShareMode(params.get("mode") ?? DEFAULT_MODE, grade);

  return { grade, tier, mode };
}

export function buildShareUrl(settings, baseUrl = window.location.href) {
  const grade = normalizeGrade(settings.grade);
  const tier = normalizeTier(settings.tier);
  const mode = normalizeShareMode(settings.mode, grade);
  const url = new URL(baseUrl);

  url.search = "";
  url.searchParams.set("grade", String(grade));
  url.searchParams.set("tier", tier);
  url.searchParams.set("mode", mode);

  return url.toString();
}
