# Lodestone CSS Selectors

A ready-to-use collection of CSS selectors and Zod schemas for scraping data from the Final Fantasy XIV Lodestone. Designed for fast, lightweight parsing across TypeScript, Python, Go, Rust, and other languages.

> [!IMPORTANT]
> [The Lodestone](https://na.finalfantasyxiv.com/lodestone/) serves completely different markup to desktop and mobile clients. These selectors are strictly tailored to the mobile DOM structure and will not match desktop responses.

### Key Features

- **Mobile DOM Tailored:** Built explicitly for the Lodestone's mobile views, which offer a cleaner and more consistent layout for scraping.
- **Type Safety & Portability:** Schemas are written in Zod for native TypeScript support and automatically compiled into standard JSON Schemas for non-TypeScript environments.
- **Lightweight & DOMless:** Fully compatible with fast HTML parsers (such as Cheerio, Happy DOM, or BeautifulSoup) without requiring a heavy, headless browser instance.

## Quick Start

Add this repository to your project to keep selectors updated without manual file management:

```sh
git submodule add https://github.com/xivapi/lodestone-css-selectors.git <path>
```

(For details on managing submodules, see the [Official Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)).

## Project Lineage

This repository inherits its design from [miichom/lodestone](https://github.com/miichom/lodestone) (now merged into [xivapi/nodestone](https://github.com/xivapi/nodestone)).

## Contributing

Contributions are welcome! If you want to update or add new selectors, simply submit a Pull Request with your changes to the TypeScript/Zod source schemas.

> [!NOTE]
> You don't need to manually recompile the JSON output. The CI pipeline generates and commits the updated JSON files automatically when merged.
