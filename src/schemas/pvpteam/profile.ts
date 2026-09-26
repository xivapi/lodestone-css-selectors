import * as z from "zod/v4";

export const profile = z.object({
  name: z.string().meta({ selector: "h2.entry__pvpteam__name--team" }),
  server: z.object({
    dc: z.string().meta({ selector: "p.entry__pvpteam__name--dc" }),
  }),
  crest: z.array(z.url()).meta({
    selector: "div.entry__pvpteam__crest img:not([class])",
    attribute: "src",
  }),
  formed_at: z
    .string()
    .transform((val) => {
      const match = val.match(/ldst_strftime\((\d+)/);
      return match ? parseInt(match[1], 10) * 1000 : val;
    })
    .pipe(z.coerce.date())
    .meta({
      selector: "p.entry__pvpteam__data--formed > script",
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
          selector: "a.entry__bg",
          attribute: "href",
          regex: /(\d+)/.source,
        }),
      name: z.string().meta({ selector: "p.entry__name" }),
      avatar: z.url().meta({
        selector: "div.entry__chara__face > img",
        attribute: "src",
      }),
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
          name: z.string().meta({
            selector:
              "ul.entry__pvpteam__member__info > li:not(:has(i.list__ic__class)):first-of-type > span",
          }),
          icon: z.url().meta({
            selector:
              "ul.entry__pvpteam__member__info > li:not(:has(i.list__ic__class)):first-of-type > img",
            attribute: "src",
          }),
        })
        .nullable()
        .default(null),
      matches: z.coerce.number().default(0).meta({
        selector:
          "ul.entry__pvpteam__member__info > li:not(:has(i.list__ic__class)):last-of-type > span",
      }),
    })
  )
  .meta({ selector: "div.pvpteam__member > div.entry" });
