// This was made for test suites however it got messy in testing.
// You can use this file for testing the schemas, please see below for a basic example:

/* async () => {
  const res = await fetch(
    "https://na.finalfantasyxiv.com/lodestone/character/29193229/",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Android 16; Mobile; rv:147.0) Gecko/147.0 Firefox/147.0",
      },
    },
  );

  if (!res.ok) throw res;

  const html = await res.text();
  const dom = Document.parseHTMLUnsafe(html);

  const result = parse(dom, schema);
  console.log(result);
}; */

import type * as z from "zod/v4";

// Just a handle little function to mimic z.globalRegistry.get(schema).
const metadata = <T>(schema: z.core.ZodStandardJSONSchemaPayload<T>) => {
  if (!schema.selector) return undefined;
  return {
    selector: schema.selector as string,
    regex: schema.regex as string | undefined,
    attribute: schema.attribute as string | undefined,
  };
};

// For testing purposes only, see https://github.com/xivapi/nodestone for full example.
// In the nodestone version, it will do the schema.safeParse(raw) and run the transforms.
// We only care about the raw values to test if the selectors work!
export function parse<T = unknown>(
  dom: Document | Element,
  schema: z.core.ZodStandardJSONSchemaPayload<T>
): z.output<T> | null | undefined {
  if (schema.type === "null") return null;

  const meta = metadata(schema);

  if (
    meta?.selector &&
    schema.type !== "array" &&
    (schema.type !== "object" || meta.regex)
  ) {
    const node = dom.querySelector(meta.selector);
    if (!node) return (schema.default as z.output<T>) ?? undefined;

    const raw = meta.attribute
      ? node.getAttribute(String(meta.attribute))?.trim()
      : node.textContent.trim();

    if (raw && meta.regex) {
      const regex = new RegExp(meta.regex);
      const match = regex.exec(raw);
      if (!match) return (schema.default as z.output<T>) ?? undefined;

      if (schema.type === "object") return match.groups as z.output<T>;
      return (match[1] ?? match[0]) as z.output<T>;
    }

    return (raw as z.output<T>) ?? (schema.default as z.output<T>) ?? undefined;
  }

  if (schema.anyOf) {
    for (const inner of schema.anyOf) {
      const result = parse(
        dom,
        inner as z.core.ZodStandardJSONSchemaPayload<unknown>
      );

      if (result !== undefined) return result as z.output<T>;
    }

    return (schema.default as z.output<T>) ?? undefined;
  }

  if (schema.type === "array") {
    if (!meta?.selector) return (schema.default as z.output<T>) ?? undefined;
    const nodes = Array.from(dom.querySelectorAll(meta.selector));
    const inner = schema.items as z.core.ZodStandardJSONSchemaPayload<unknown>;

    const results = nodes
      .map((node) => {
        if (inner.type !== "object" && !metadata(inner)?.selector) {
          const val = meta.attribute
            ? node.getAttribute(String(meta.attribute))?.trim()
            : node.textContent?.trim();
          return val;
        }
        return parse(node, inner);
      })
      .filter((val) => val !== undefined && val !== null);

    return results.length > 0
      ? (results as z.output<T>)
      : ((schema.default as z.output<T>) ?? undefined);
  } else if (schema.type === "object") {
    const target = meta?.selector
      ? dom.querySelector(meta.selector)
      : (dom as Element);
    if (!target) return (schema.default as z.output<T>) ?? undefined;

    const entries = Object.entries(schema.properties ?? {})
      .map(([key, _inner]) => {
        const inner = _inner as z.core.ZodStandardJSONSchemaPayload<unknown>;
        const submeta = metadata(inner);

        if (submeta?.selector || inner.type === "object" || inner.anyOf) {
          return [key, parse(target, inner)];
        }

        const raw = submeta?.attribute
          ? target.getAttribute(String(submeta.attribute))?.trim()
          : target.textContent?.trim();

        return [key, raw ?? inner.default ?? undefined];
      })
      .filter(([_, value]) => value !== undefined);

    return entries.length > 0
      ? (Object.fromEntries(entries) as z.output<T>)
      : ((schema.default as z.output<T>) ?? undefined);
  }

  return (schema.default as z.output<T>) ?? undefined;
}
