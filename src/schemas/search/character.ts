import * as z from "zod/v4";
import { Datacenter, Region } from "../models.js";

export const query = z.object({
  q: z.string(),
  worldname: z
    .union([
      z.enum(Region),
      z.enum(Datacenter),
      z.string().regex(/^[A-Za-z]+$/),
    ])
    .optional(),
  classjob: z
    .union([
      z.templateLiteral([
        "_class_",
        z.literal(["TANK", "HEALER", "DPS", "CRAFTER", "GATHERER"]),
      ]),
      z.number().min(1).max(43),
    ])
    .optional(),
  race_tribe: z
    .union([
      z.templateLiteral(["race_", z.number().min(1).max(8)]),
      z.templateLiteral(["tribe_", z.number().min(1).max(16)]),
    ])
    .optional(),
  gcid: z.number().min(0).max(3).optional(),
  blog_lang: z.enum(["ja", "en", "de", "fr"]).optional(),
  order: z.number().min(1).max(8).optional(),
  page: z.number().min(1).max(20).optional(),
});

export const entries = z
  .array(
    z.object({
      id: z
        .string()
        .transform((val) => val.match(/(\d+)/)?.[0].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector: "a.entry__link",
          attribute: "href",
          regex: /(\d+)/.source,
        }),
      name: z.string().meta({ selector: "p.entry__name" }),
      avatar: z
        .url()
        .meta({ selector: "div.entry__chara__face > img", attribute: "src" }),
      server: z
        .string()
        .transform((val) => {
          const match = val.match(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/);
          return match?.groups as { world: string; dc: string };
        })
        .pipe(z.object({ world: z.string(), dc: z.string() }))
        .meta({
          selector: "p.entry__world",
          regex: /^(?<world>.+?)\s*\[(?<dc>.*?)\]$/.source,
        }),
      languages: z
        .string()
        .transform((val) => val.split("/"))
        .pipe(z.array(z.string()))
        .meta({ selector: "div.entry__chara__lang" }),
      grand_company: z
        .object({
          name: z
            .string()
            .transform((val) => val.split("/")[0]?.trim() ?? val.trim())
            .pipe(z.string())
            .meta({ selector: "li.js__tooltip", attribute: "data-tooltip" }),
          rank: z.object({
            name: z
              .string()
              .transform((val) => val.split("/")[1]?.trim() ?? val.trim())
              .pipe(z.string())
              .meta({ selector: "li.js__tooltip", attribute: "data-tooltip" }),
            icon: z
              .url()
              .meta({ selector: "li.js__tooltip > img", attribute: "src" }),
          }),
        })
        .optional(),
      free_company: z
        .object({
          id: z
            .string()
            .transform(
              (val) =>
                val.match(/lodestone\/freecompany\/(\d+)\//)?.[1].trim() ??
                val.trim()
            )
            .pipe(z.string())
            .meta({
              selector: "a.entry__freecompany__link",
              attribute: "href",
              regex: /lodestone\/freecompany\/(\d+)\//.source,
            }),
          name: z
            .string()
            .meta({ selector: "a.entry__freecompany__link > span" }),
          crest: z.array(z.url()).meta({
            selector: "a.entry__freecompany__link > img",
            attribute: "src",
          }),
        })
        .optional(),
    })
  )
  .meta({ selector: "div.ldst__window div.entry" });
