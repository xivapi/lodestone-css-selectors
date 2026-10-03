import * as z from "zod/v4";
import { Race, Tribe } from "../models.ts";

export const profile = z.object({
  name: z.string().meta({ selector: "p.frame__chara__name" }),
  avatar: z.url().meta({
    selector: "div.frame__chara__face > img",
    attribute: "src",
  }),
  portrait: z
    .url()
    .meta({
      selector: "div.character__detail__image img",
      attribute: "src",
    })
    .optional(),
  server: z
    .string()
    .transform((val) => val.match(/^(?<world>.+?)\s*\[(?<dc>.*?)\]$/)?.groups)
    .pipe(z.object({ world: z.string(), dc: z.string() }))
    .meta({
      selector: "p.frame__chara__world",
      regex: /^(?<world>.+?)\s*\[(?<dc>.*?)\]$/.source,
    }),
  title: z.string().meta({ selector: "p.frame__chara__title" }),
  bio: z
    .string()
    .default("-")
    .meta({ selector: "div.character__character_profile" }),
  identity: z
    .string()
    .transform((val) => {
      const groups = val.match(
        new RegExp(
          `^(?<race>${Object.keys(Race).join("|")})(?<clan>${Object.keys(Tribe).join("|")}) / (?<gender>\\W)`
        )
      )?.groups;

      return { ...groups, gender: groups?.gender === "♀" ? "Female" : "Male" };
    })
    .pipe(
      z.object({
        race: z.string(),
        clan: z.string(),
        gender: z.literal(["Male", "Female"]),
      })
    )
    .meta({
      selector: "div.character-block:nth-child(2) p.character-block__profile",
      regex: `^(?<race>${Object.keys(Race).join("|")})(?<clan>${Object.keys(Tribe).join("|")}) / (?<gender>\\W)`,
    }),
  nameday: z.string().meta({ selector: "p.character-block__birth" }),
  guardian: z
    .string()
    .meta({ selector: "p.character-block__profile:nth-of-type(4)" }),
  citystate: z.string().meta({
    selector: "div.character-block:nth-child(4) p.character-block__profile",
  }),
  grand_company: z
    .object({
      name: z
        .string()
        .transform((val) => val.match(/(\D+) \/ \D+/)?.[1].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector:
            "div.character-block:nth-of-type(4) p.character-block__profile",
          regex: /(\D+) \/ \D+/.source,
        }),
      rank: z.object({
        name: z
          .string()
          .transform(
            (val) => val.match(/\D+ \/ (\D+)/)?.[1].trim() ?? val.trim()
          )
          .pipe(z.string())
          .meta({
            selector:
              "div.character-block:nth-of-type(4) p.character-block__profile",
            regex: /\D+ \/ (\D+)/.source,
          }),
        icon: z.url().meta({
          selector: "div.character-block:nth-of-type(4) > img",
          attribute: "src",
        }),
      }),
    })
    .nullable()
    .default(null),
  free_company: z
    .object({
      id: z
        .string()
        .transform(
          (val) =>
            val.match(/lodestone\/freecompany\/(\S+)\//)?.[1].trim() ??
            val.trim()
        )
        .pipe(z.string())
        .meta({
          selector: 'a.entry__freecompany[href*="/freecompany/"]',
          attribute: "href",
          regex: /lodestone\/freecompany\/(\S+)\//.source,
        }),
      name: z.string().meta({
        selector:
          'a.entry__freecompany[href*="/freecompany/"] div.character__freecompany__name > h4',
      }),
      crest: z.url().array().meta({
        selector:
          'a.entry__freecompany[href*="/freecompany/"] div.character__freecompany__crest__image > img',
        attribute: "src",
      }),
    })
    .nullable()
    .default(null),
  pvp_team: z
    .object({
      id: z
        .string()
        .transform(
          (val) =>
            val.match(/lodestone\/pvpteam\/(\S+)\//)?.[1].trim() ?? val.trim()
        )
        .pipe(z.string())
        .meta({
          selector: 'a.entry__freecompany[href*="/pvpteam/"]',
          attribute: "href",
          regex: /lodestone\/pvpteam\/(\S+)\//.source,
        }),
      name: z.string().meta({
        selector:
          'a.entry__freecompany[href*="/pvpteam/"] div.character__freecompany__name > h4',
      }),
      crest: z.url().array().meta({
        selector:
          'a.entry__freecompany[href*="/pvpteam/"] div.character__freecompany__crest__image > img',
        attribute: "src",
      }),
    })
    .nullable()
    .default(null),
});

// Contains HP, MP, GP and CP (and language variants)
export const stats = z
  .array(
    z.object({
      type: z.string().meta({ selector: "p.character__param__text" }),
      value: z.coerce.number().meta({ selector: "span" }),
    })
  )
  .meta({ selector: "ul.character__param div" });

// Automatically grabs the key/value pairs, unlike before these selectors will not break if
// the job is not a combat job - Crafting/Gathering section would replace the Job section for
// combat jobs, e.g., Craftsmanship would be mapped under Tenacity.
export const attributes = z
  .array(
    z
      .string()
      .transform((val) => {
        const groups = val.match(/^(?<type>\D+)(?<value>\d+)/)?.groups;
        return {
          type: groups?.type.trim() as string,
          value: Number(groups?.value),
        };
      })
      .pipe(z.object({ type: z.string(), value: z.number() }))
  )
  .meta({
    selector: "table.character__param__list tr",
    regex: /^(?<type>\D+)(?<value>\d+)/.source,
  });
