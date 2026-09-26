import * as z from "zod/v4";

export const members = z
  .array(
    z.object({
      id: z
        .string()
        .transform((val) => val.match(/(\d+)/)?.[0].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector: "a.entry__bg",
          attribute: "href",
          regex: /(\d+)/.source,
        }),
      name: z.string().meta({ selector: "p.entry__name" }),
      avatar: z
        .url()
        .meta({ selector: "div.entry__chara__face > img", attribute: "src" }),
      server: z
        .string()
        .regex(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/)
        .transform((val) => {
          const match = val.match(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/);
          return match?.groups as { world: string; dc: string };
        })
        .pipe(z.object({ world: z.string(), dc: z.string() }))
        .meta({ selector: "p.entry__world" }),
      rank: z.object({
        name: z.string().meta({
          selector: "ul.entry__chara_info > li:first-of-type > span",
        }),
        icon: z.url().meta({
          selector: "ul.entry__chara_info > li:first-of-type > img",
          attribute: "src",
        }),
      }),
    })
  )
  .meta({ selector: "div.freecompany_characters li.entry" });
