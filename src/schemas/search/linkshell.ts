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
  character_count: z.literal(["1-10", "11-30", "31-50", "51-"]).optional(),
  order: z.number().min(1).max(6).optional(),
  page: z.number().min(1).max(20).optional(),
});

export const entries = z
  .array(
    z.object({
      id: z
        .string()
        .transform(
          (val) =>
            val.match(/lodestone\/linkshell\/(\d+)\//)?.[1].trim() ?? val.trim()
        )
        .pipe(z.string())
        .meta({
          selector: "a.entry__link--line",
          attribute: "href",
          regex: /lodestone\/linkshell\/(\d+)\//.source,
        }),
      name: z.string().meta({ selector: "p.entry__name" }),
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
      members: z.coerce
        .number()
        .meta({ selector: "div.entry__linkshell__member span" }),
    })
  )
  .meta({ selector: "div.ldst__window div.entry" });
