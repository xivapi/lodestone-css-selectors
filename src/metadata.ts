import pkg from "../package.json" with { type: "json" };

export const version = pkg.version;

export const headers = {
  // This User-Agent mimics a standard mobile browser while appending custom crawler details.
  // If overriding this header in your application, please be polite and include your own crawler identifier (Compatible; ...)
  "User-Agent": `Mozilla/5.0 (Android 16; Mobile; rv:147.0) Gecko/147.0 Firefox/147.0 (Compatible; ${pkg.name.split("/")[1]}/${pkg.version}; +${pkg.homepage})`,
};

export const endpoints = {
  "/character/profile":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/",
  "/character/gearset":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/equipment/tooltip/%d/",

  "/cwls/profile":
    "https://%s.finalfantasyxiv.com/lodestone/crossworld_linkshell/%s/",
  "/freecompany/profile":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/%d/",

  "/freecompany/members":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/%d/member/",
  "/linkshell/profile":
    "https://%s.finalfantasyxiv.com/lodestone/linkshell/%d/",

  "/pvpteam/profile": "https://%s.finalfantasyxiv.com/lodestone/pvpteam/%s/",

  "/search/character": "https://%s.finalfantasyxiv.com/lodestone/character/",
  "/search/cwls":
    "https://%s.finalfantasyxiv.com/lodestone/crossworld_linkshell/",
  "/search/freecompany":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/",
  "/search/linkshell": "https://%s.finalfantasyxiv.com/lodestone/linkshell/",
  "/search/pvpteam": "https://%s.finalfantasyxiv.com/lodestone/pvpteam/",
};
