# Lodestone CSS Selectors

A ready-to-use collection of CSS selectors for scraping data from the Final Fantasy XIV Lodestone. Designed for fast, lightweight parsing across JavaScript, Python, Go, Rust, and other languages.

> [!IMPORTANT]
> [The Lodestone](https://na.finalfantasyxiv.com/lodestone/) serves significantly different markup to desktop and mobile clients. These selectors are strictly tailored to the mobile DOM structure and will not match desktop responses. Ensure your scraper sends a mobile User-Agent string.

### Key Features

- **Mobile DOM Tailored:** Built explicitly for the Lodestone's mobile views, which provide a cleaner, more reliable layout for data extraction.
- **Lightweight & DOMless:** Fully compatible with fast HTML parsers (such as Cheerio, Happy DOM, or BeautifulSoup) without requiring a heavy, headless browser instance like Puppeteer or Playwright.
- **Language Agnostic:** Selector schemas are published as pure JSON, making them effortless to consume in any language environment.

## Installation

Add this repository as a submodule to keep your project's selectors updated without manual copying:

```sh
git submodule add https://github.com/xivapi/lodestone-css-selectors.git <path>
```

(For details on managing submodules, see the [Official Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)).

## Project Lineage & Automation

This repository acts as the distribution target for [xivapi/nodestone](https://github.com/xivapi/nodestone), inheriting its selector design from [miichom/lodestone](https://github.com/miichom/lodestone).

## Contributing

Contributions are welcome! If you find missing selectors or outdated markup rules, feel free to open an issue or submit a Pull Request directly to this repository.