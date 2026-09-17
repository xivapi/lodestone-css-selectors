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
  activities: z.number().min(-1).max(8).optional(),
  roles: z
    .enum({
      Tank: 16,
      Healer: 17,
      DPS: 18,
      Crafter: 19,
      Gatherer: 20,
      "Not specified": -1,
    })
    .optional(),
  activetime: z.number().min(1).max(3).optional(),
  join: z.boolean().optional(),
  house: z.number().min(0).max(2).optional(),
  gcid: z.number().min(0).max(3).optional(),
  order: z.number().min(1).max(6).optional(),
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
          selector: "a.entry__block",
          attribute: "href",
          regex: /(\d+)/.source,
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
          selector: "p.entry__world:last-of-type",
          regex: /^(?<world>.+?)\s*\[(?<dc>.*?)\]$/.source,
        }),
      crest: z.array(z.url()).meta({
        selector: "div.entry__freecompany__crest__image > img",
        attribute: "src",
      }),
      grand_company: z
        .string()
        .meta({ selector: "p.entry__world:first-of-type" }),
      details: z.object({
        members: z.coerce
          .number()
          .meta({ selector: "li.entry__freecompany__fc-member" }),
        estate: z
          .string()
          .meta({ selector: "li.entry__freecompany__fc-housing" }),
        formed_at: z
          .string()
          .transform((val) => {
            const match = val.match(/ldst_strftime\((\d+)/);
            return match ? parseInt(match[1], 10) * 1000 : val;
          })
          .pipe(z.coerce.date())
          .meta({
            selector: "li.entry__freecompany__fc-day > script",
            regex: /ldst_strftime\((\d+)/.source,
          }),
        active: z
          .string()
          .transform((val) => {
            const match = val.match(/^[^:]+:\s*(.+)$/);
            return match ? match[1].trim() : val.trim();
          })
          .pipe(z.string())
          .meta({
            selector: "li.entry__freecompany__fc-active:nth-last-child(2)",
            regex: /^[^:]+:\s*(.+)$/.source,
          }),
        recruitment: z
          .string()
          .transform((val) => {
            const match = val.match(/^[^:]+:\s*(.+)$/);
            return match ? match[1].trim() : val.trim();
          })
          .pipe(z.string())
          .meta({
            selector: "li.entry__freecompany__fc-active:last-of-type",
            regex: /^[^:]+:\s*(.+)$/.source,
          }),
      }),
    })
  )
  .meta({ selector: "div.ldst__window div.entry" });
