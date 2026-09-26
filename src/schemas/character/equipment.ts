import * as z from "zod/v4";

export const equipment = z.object({
  name: z.string().meta({ selector: "h1.db-view__header__detail__item-name" }),
  icon: z.url().meta({
    selector: "img.db-view__header__item-image--icon",
    attribute: "src",
  }),
  category: z
    .string()
    .meta({ selector: "h2.db-view__header__detail__category-name" }),
  ilvl: z
    .string()
    .transform(
      (val) => val.match(/(?<level>\d+)/)?.groups?.level.trim() ?? val.trim()
    )
    .pipe(z.coerce.number())
    .meta({
      selector: "h3.db-view__item-level",
      regex: /(?<level>\d+)/.source,
    }),
  equip: z.object({
    class: z
      .string()
      .transform((val) => val.match(/\b[A-Z]{3}\b/g) ?? [val])
      .pipe(z.array(z.string()))
      .meta({
        selector: "div.db-view__item-equip-text p:nth-of-type(1)",
        regex: /\b[A-Z]{3} \b/g.source,
      }),
    level: z
      .string()
      .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
      .pipe(z.coerce.number())
      .meta({
        selector: "div.db-view__item-equip-text p:nth-of-type(2)",
        regex: /(\d+)/.source,
      }),
  }),
  attributes: z.object({
    main: z
      .array(
        z.object({
          type: z.string().meta({ selector: "dt" }),
          value: z.coerce.number().meta({ selector: "dd" }),
        })
      )
      .meta({
        selector:
          "div.db-view__item-info dl.db-view__item-info__list--main-status",
      }),
    bonus: z
      .array(
        z.object({
          type: z.string().meta({ selector: "span.name" }),
          value: z.coerce.number().meta({ selector: "span.value" }),
        })
      )
      .meta({
        selector:
          "div.db-view__item-info ul.db-view__item-info__list--bonuses > li",
      }),
    effect: z
      .array(
        z
          .string()
          .transform((val) => {
            const groups = val.match(/^(?<type>\D+) (?<value>\W\d+)/)?.groups;
            return {
              type: groups?.type.trim() as string,
              value: Number(groups?.value),
            };
          })
          .pipe(z.object({ type: z.string(), value: z.number() }))
      )
      .meta({
        selector: "div.db-view__series_bonus li",
        regex: /^(?<type>\D+) (?<value>\W\d+)/.source,
      })
      .optional(),
  }),
  materia: z.array(z.object({})).optional().meta({
    selector: "div.db-view__item-info ul.character-item__materia-list > li",
  }),
  flags: z.object({
    repair: z.object({
      req: z
        .string()
        .transform((val) => {
          const groups = val.match(/(?<class>\D+) \D+ (?<level>\d+)/)?.groups;
          return {
            class: groups?.class.trim() as string,
            level: Number(groups?.level),
          };
        })
        .pipe(z.object({ class: z.string(), level: z.number() }))
        .meta({
          selector:
            "div.db-view__item-info__table--craft_repair tr:nth-of-type(3) > td",
          regex: /(?<class>\D+) \D+ (?<level>\d+)/.source,
        }),
      material: z.string().meta({
        selector:
          "div.db-view__item-info__table--craft_repair tr:nth-of-type(4) > td",
      }),
    }),
    extractable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector:
          "ul.db-view__item-info__craft_repair > li:nth-of-type(1) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    projectable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector:
          "ul.db-view__item-info__craft_repair > li:nth-of-type(2) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    desynthesizable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector:
          "ul.db-view__item-info__craft_repair > li:nth-of-type(3) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    dyeable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector:
          "ul.db-view__item-info__craft_repair > li:nth-of-type(4) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
  }),
});
