import * as z from "zod/v4";

export const profile = z.object({
  name: z.string().meta({ selector: "p.frame__chara__name" }),
  server: z
    .string()
    .regex(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/)
    .transform((val) => {
      const match = val.match(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/);
      return match?.groups as { world: string; dc: string };
    })
    .pipe(z.object({ world: z.string(), dc: z.string() }))
    .meta({
      selector:
        "div.linkshell_characters > div.entry:first-of-type p.entry__world",
    }),
});

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
      rank: z
        .object({
          name: z
            .string()
            .meta({ selector: "li.entry__chara_info__linkshell > span" }),
          icon: z.url().meta({
            selector: "li.entry__chara_info__linkshell > img",
            attribute: "src",
          }),
        })
        .nullable()
        .default(null),
    })
  )
  .meta({ selector: "div.linkshell_characters > div.entry" });
