import pkg from "../package.json" with { type: "json" };

export const version = pkg.version;

export const headers = {
  "User-Agent": `Mozilla/5.0 (Android 16; Mobile; rv:147.0) Gecko/147.0 Firefox/147.0 (Compatible; ${pkg.name.split("/")[1]}/${pkg.version}; +${pkg.homepage})`,
};

export const endpoints = {
  "/search/character": "https://%s.finalfantasyxiv.com/lodestone/character/",
  "/character/profile":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/",
  "/character/achievement":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/achievement/",
  "/character/classjob":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/class_job/",
  "/character/emote":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/emote/",
  "/character/equipment":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/equipment/%d/",
  "/character/facewear":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/faceaccessory/",
  "/character/minion":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/minion/",
  "/character/mount":
    "https://%s.finalfantasyxiv.com/lodestone/character/%d/mount/",

  "/search/cwls":
    "https://%s.finalfantasyxiv.com/lodestone/crossworld_linkshell/",
  "/cwls/profile":
    "https://%s.finalfantasyxiv.com/lodestone/crossworld_linkshell/%s/",

  "/search/freecompany":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/",
  "/freecompany/profile":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/%d/",
  "/freecompany/member":
    "https://%s.finalfantasyxiv.com/lodestone/freecompany/%d/member/",

  "/search/linkshell": "https://%s.finalfantasyxiv.com/lodestone/linkshell/",
  "/linkshell/profile":
    "https://%s.finalfantasyxiv.com/lodestone/linkshell/%d/",

  "/search/pvpteam": "https://%s.finalfantasyxiv.com/lodestone/pvpteam/",
  "/pvpteam/profile": "https://%s.finalfantasyxiv.com/lodestone/pvpteam/%s/",
};
