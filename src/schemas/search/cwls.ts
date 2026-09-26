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
            val.match(/lodestone\/crossworld_linkshell\/(\S+)\//)?.[1].trim() ??
            val.trim()
        )
        .pipe(z.string())
        .meta({
          selector: "a",
          attribute: "href",
          regex: /lodestone\/crossworld_linkshell\/(\S+)\//.source,
        }),
      name: z.string().meta({ selector: "div > h4" }),
      server: z.object({
        dc: z.string().meta({ selector: "li:first-of-type" }),
      }),
      members: z.coerce.number().meta({ selector: "li:last-of-type > span" }),
    })
  )
  .meta({ selector: "div.linkshells > div" });
