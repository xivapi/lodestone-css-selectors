# Lodestone CSS Selectors

A ready-to-use collection of CSS selectors for scraping data from the Final Fantasy XIV Lodestone. Designed for fast, lightweight parsing across JavaScript, Python, Go, Rust, and other languages.

> [!IMPORTANT]
> [The Lodestone](https://na.finalfantasyxiv.com/lodestone/) serves significantly different markup to desktop and mobile clients. These selectors are strictly tailored to the mobile DOM structure and will not match desktop responses. Ensure your scraper sends a mobile `User-Agent` string.

## Installation

Add this repository as a submodule to keep your project's selectors updated without manual copying:

```sh
git submodule add https://github.com/xivapi/lodestone-css-selectors.git <path>
```

(For details on managing submodules, see the [Official Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)).

## Project Structure

This repository organises selector files by endpoints on The Lodestone under designated subdirectories:

```
lodestone-css-selectors/
├── search/
│   ├── character.json       # Search characters
│   ├── freecompany.json     # Search freecompanies
│   └── pvpteam.json         # Search pvpteams
├── character/
│   ├── profile.json         # Character profile
└── ...
```

## Schema Structure

Selector files are valid [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core) definitions. Beyond defining expected target data types, property definitions embed custom DOM-scraping keywords.

### Scraper Extensions

Properties in the schema define DOM parsing instructions alongside standard JSON Schema keywords:

| Key         | Type     | Required | Description                                                                                             |
| ----------- | -------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `selector`  | `string` | Yes      | CSS selector targeting the mobile DOM element(s).                                                       |
| `attribute` | `string` | No       | HTML attribute to extract (e.g., `"src"`, `"href"`). If omitted, extract `textContent`.                 |
| `regex`     | `string` | No       | Regular expression pattern (supports named capture groups) to extract sub-strings from text/attributes. |

### Schema Example

```json
// search/character.json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "total": {
      "type": "number",
      "selector": "div.parts__fraction",
      "regex": "(\\d+)"
    },
    "items": {
      "type": "array",
      "selector": "div.characters > div",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "selector": "a.entry__chara__link",
            "attribute": "href",
            "regex": "(\\d+)"
          },
          "name": {
            "type": "string",
            "selector": "p.entry__name"
          },
          "avatar": {
            "type": "string",
            "format": "uri",
            "selector": "div.entry__chara__face > img",
            "attribute": "src"
          },
          "server": {
            "type": "object",
            "selector": "p.entry__world",
            "regex": "^(?<world>.+?)\\s*\\[(?<dc>.*?)\\]$",
            "properties": {
              "world": { "type": "string" },
              "dc": { "type": "string" }
            },
            "required": ["world", "dc"],
            "additionalProperties": false
          },
          "languages": {
            "type": "array",
            "selector": "div.entry__chara__lang",
            "items": { "type": "string" }
          }
        },
        "required": ["id", "name", "avatar", "server", "languages"],
        "additionalProperties": false
      }
    }
  },
  "required": ["total", "items"],
  "additionalProperties": false
}
```

## Contributing

Contributions are welcome! If you find missing selectors or outdated markup rules, feel free to open an issue or submit a Pull Request directly to this repository.
