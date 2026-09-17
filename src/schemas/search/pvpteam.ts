import * as z from "zod/v4";
import { Datacenter, Region } from "../models.js";

export const query = z.object({
  q: z.string(),
  cf_public: z.boolean().optional(),
  worldname: z
    .union([
      z.enum(Region),
      z.enum(Datacenter),
      z.string().regex(/^[A-Za-z]+$/),
    ])
    .optional(),
  order: z.number().min(1).max(4).optional(),
  page: z.number().min(1).max(20).optional(),
});

export const entries = z
  .array(
    z.object({
      id: z
        .string()
        .transform(
          (val) =>
            val.match(/lodestone\/pvpteam\/(\S+)\//)?.[1].trim() ?? val.trim()
        )
        .pipe(z.string())
        .meta({
          selector: "a.entry__block",
          attribute: "href",
          regex: /lodestone\/pvpteam\/(\S+)\//.source,
        }),
      name: z.string().meta({ selector: "p.entry__name" }),
      server: z.object({
        dc: z.string().meta({ selector: "p.entry__world" }),
      }),
      crest: z.array(z.url()).meta({
        selector: "div.entry__pvpteam__search__crest__image > img",
        attribute: "src",
      }),
    })
  )
  .meta({ selector: "div.ldst__window div.entry" });
