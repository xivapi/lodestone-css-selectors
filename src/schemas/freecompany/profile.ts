import * as z from "zod/v4";

export const profile = z.object({
  name: z.string().meta({ selector: "p.freecompany__text__name" }),
  server: z
    .string()
    .transform((val) => val.match(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/)?.groups)
    .pipe(z.object({ world: z.string(), dc: z.string() }))
    .meta({
      selector: "p.entry__freecompany__gc:last-of-type",
      regex: /^(?<world>.+?)\s*\[(?<dc>.*?)\]$/.source,
    }),
  slogan: z.string().meta({ selector: "p.freecompany__text__message" }),
  tag: z
    .string()
    .transform((val) => val.match(/«(\S+)»/)?.[1].trim() ?? val.trim())
    .pipe(z.string())
    .meta({
      selector: "p.freecompany__text__tag",
      regex: /«(\S+)»/.source,
    }),
  formed_at: z
    .string()
    .transform((val) => {
      const match = val.match(/ldst_strftime\((\d+)/);
      return match ? parseInt(match[1], 10) * 1000 : val;
    })
    .pipe(z.coerce.date())
    .meta({
      selector: "p.freecompany__text > script",
      regex: /ldst_strftime\((\d+)/.source,
    }),
  stats: z.object({
    members: z
      .string()
      .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
      .pipe(z.coerce.number())
      .meta({
        selector: "p.freecompany__text:nth-of-type(6)",
        regex: /(\d+)/.source,
      }),
    rank: z
      .string()
      .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
      .pipe(z.coerce.number())
      .meta({
        selector: "p.freecompany__text:nth-of-type(7)",
        regex: /(\d+)/.source,
      }),
    rankings: z.object({
      weekly: z
        .string()
        .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
        .pipe(z.coerce.number())
        .meta({
          selector: "table.character__ranking__data tr:nth-of-type(1) th",
          regex: /(\d+)/.source,
        }),
      monthly: z
        .string()
        .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
        .pipe(z.coerce.number())
        .meta({
          selector: "table.character__ranking__data tr:nth-of-type(2) th",
          regex: /(\d+)/.source,
        }),
    }),
  }),
  grand_company: z.object({
    selected: z
      .string()
      .transform((val) => val.match(/^(\D+) <\D+>/)?.[1].trim() ?? val.trim())
      .pipe(z.string())
      .meta({
        selector: "p.entry__freecompany__gc:first-of-type",
        regex: /^(\D+) <\D+>/.source,
      }),
    reputation: z
      .array(
        z.object({
          name: z.string().meta({
            selector: "p.freecompany__reputation__gcname",
          }),
          icon: z.url().meta({
            selector: "div.freecompany__reputation__icon > img",
            attribute: "src",
          }),
          rank: z.string().meta({
            selector: "p.freecompany__reputation__rank",
          }),
        })
      )
      .meta({ selector: "div.freecompany__reputation" }),
  }),
  estate: z
    .object({
      name: z.string().meta({ selector: "p.freecompany__estate__name" }),
      address: z.string().meta({ selector: "p.freecompany__estate__text" }),
      greeting: z
        .string()
        .meta({ selector: "p.freecompany__estate__greeting" }),
    })
    .nullable()
    .default(null),
  recruitment: z.object({
    active: z.string().meta({
      selector:
        "div.ldst__window:last-of-type > p.freecompany__text:nth-of-type(1)",
    }),
    recruitment: z.string().meta({
      selector:
        "div.ldst__window:last-of-type > p.freecompany__text:nth-of-type(2)",
    }),
    focus: z
      .array(
        z.object({
          name: z.string().meta({ selector: "p" }),
          icon: z.url().meta({ selector: "div > img", attribute: "src" }),
        })
      )
      .meta({
        selector:
          'ul.freecompany__focus_icon:nth-of-type(1) > li:not([class*="off"])',
      }),
    seeking: z
      .array(
        z.object({
          name: z.string().meta({ selector: "p" }),
          icon: z.url().meta({ selector: "div > img", attribute: "src" }),
        })
      )
      .meta({
        selector:
          'ul.freecompany__focus_icon:nth-of-type(2) > li:not([class*="off"])',
      }),
  }),
});
