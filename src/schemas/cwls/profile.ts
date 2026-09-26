import * as z from "zod/v4";

export const profile = z.object({
  name: z.string().meta({ selector: "p.frame__cwls__name" }),
  server: z.object({
    dc: z.string().meta({ selector: "span.frame__cwls__world" }),
  }),
  formed_at: z
    .string()
    .transform((val) => {
      const match = val.match(/ldst_strftime\((\d+)/);
      return match ? parseInt(match[1], 10) * 1000 : val;
    })
    .pipe(z.coerce.date())
    .meta({
      selector: "span.frame__cwls__formed > script",
      regex: /ldst_strftime\((\d+)/.source,
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
          selector: "a.cf-member-list",
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
  .meta({ selector: "div.linkshell_characters div.entry__bg" });
