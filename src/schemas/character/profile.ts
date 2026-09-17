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
    .meta({ selector: "div.character__selfintroduction" }),
  lore: z
    .string()
    .transform((val) => {
      const matches = val.match(
        new RegExp(
          `^(?<race>${Object.keys(Race).join("|")})<br>(?<clan>${Object.keys(Tribe).join("|")}) / (?<gender>\\W)`
        )
      );
      return {
        race: matches?.groups?.race.trim() as string,
        clan: matches?.groups?.clan.trim() as string,
        gender: matches?.groups?.gender === "♀" ? "Female" : "Male",
      };
    })
    .pipe(z.object({ race: z.string(), clan: z.string(), gender: z.string() }))
    .meta({
      selector: "div.character-block:first-of-type p.character-block__name",
      regex: `^(?<race>${Object.keys(Race).join("|")})<br>(?<clan>${Object.keys(Tribe).join("|")}) / (?<gender>\\W)`,
    }),
  nameday: z.string().meta({ selector: "p.character-block__birth" }),
  guardian: z.string().meta({
    selector: "div.character-block:nth-child(2) p.character-block__name",
  }),
  citystate: z.string().meta({
    selector: "div.character-block:nth-child(3) p.character-block__name",
  }),
  grand_company: z
    .object({
      name: z
        .string()
        .transform((val) => val.match(/(\w+) \/ \w+/)?.[1].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector:
            "div.character__profile__data__detail > div:nth-of-type(4) p.character-block__name",
          regex: /(\w+) \/ \w+/.source,
        }),
      rank: z.object({
        name: z
          .string()
          .transform(
            (val) => val.match(/\w+ \/ (\w+)/)?.[1].trim() ?? val.trim()
          )
          .pipe(z.string())
          .meta({
            selector:
              "div.character__profile__data__detail > div:nth-of-type(4) p.character-block__name",
            regex: /\w+ \/ (\w+)/.source,
          }),
        icon: z.url().meta({
          selector:
            "div.character__profile__data__detail > div:nth-of-type(4) > img",
          attribute: "src",
        }),
      }),
    })
    .optional(),
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
          selector: "div.character__freecompany__name a",
          attribute: "href",
          regex: /lodestone\/freecompany\/(\S+)\//.source,
        }),
      name: z.string().meta({
        selector: "div.character__freecompany__name a",
      }),
      crest: z.url().array().meta({
        selector: "div.character__freecompany__crest__image > img",
        attribute: "src",
      }),
    })
    .optional(),
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
          selector: "div.character__pvpteam__name a",
          attribute: "href",
          regex: /lodestone\/pvpteam\/(\S+)\//.source,
        }),
      name: z.string().meta({
        selector: "div.character__pvpteam__name a",
      }),
      crest: z.url().array().meta({
        selector: "div.character__pvpteam__crest img",
        attribute: "src",
      }),
    })
    .optional(),
});

// Contains HP, MP, GP and CP (and language variants)
export const stats = z
  .array(
    z
      .string()
      .transform((val) => {
        const groups = val.match(/(?<type>[A-Z]{2})(?<value>\d+)/)?.groups;
        return {
          type: groups?.type.trim() as string,
          value: Number(groups?.value),
        };
      })
      .pipe(z.object({ type: z.string(), value: z.number() }))
  )
  .meta({
    selector: "div.character__param > ul div",
    regex: /([A-Z]{2})(\d+)/g.source,
  });

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
