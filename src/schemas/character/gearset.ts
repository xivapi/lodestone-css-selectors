import * as z from "zod/v4";

export const gearset = z.object({
  db: z
    .string()
    .transform((val) => {
      const groups = val.match(
        /lodestone\/playguide\/db\/(?<path>\w+)\/(?<id>\S+)\//
      )?.groups;
      return {
        path: groups?.path.trim() as string,
        id: groups?.id.trim() as string,
      };
    })
    .pipe(z.object({ path: z.string(), id: z.string() }))
    .meta({
      selector: "div.db-tooltip__bt_item_detail > a",
      attribute: "href",
      regex: /lodestone\/playguide\/db\/(?<path>\w+)\/(?<id>\S+)\//.source,
    }),
  name: z.string().meta({ selector: "h2.db-tooltip__item__name" }),
  category: z.string().meta({ selector: "p.db-tooltip__item__category" }),
  ilvl: z
    .string()
    .transform(
      (val) => val.match(/(?<level>\d+)/)?.groups?.level.trim() ?? val.trim()
    )
    .pipe(z.coerce.number())
    .meta({
      selector: "div.db-tooltip__item__level",
      regex: /(?<level>\d+)/.source,
    }),
  req: z.object({
    class: z
      .string()
      .transform((val) => val.match(/\b[A-Z]{3}\b/g) ?? [val])
      .pipe(z.array(z.string()))
      .meta({
        selector: "div.db-tooltip__item_equipment__class",
        regex: /\b[A-Z]{3} \b/g.source,
      }),
    level: z
      .string()
      .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
      .pipe(z.coerce.number())
      .meta({
        selector: "div.db-tooltip__item_equipment__level",
        regex: /(\d+)/.source,
      }),
  }),
  attributes: z.object({
    spec: z
      .object({
        types: z
          .array(z.string())
          .meta({ selector: "div.db-tooltip__item_spec__name" }),
        values: z
          .array(z.coerce.number())
          .meta({ selector: "div.db-tooltip__item_spec__value" }),
      })
      .transform((val) => {
        return val.types.map((type, idx) => ({
          type: type.trim(),
          value: val.values[idx],
        }));
      })
      .pipe(z.array(z.object({ type: z.string(), value: z.number() }))),
    bonus: z
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
        selector: "ul.db-tooltip__basic_bonus > li",
        regex: /^(?<type>\D+) (?<value>\W\d+)/.source,
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
            "ul.db-tooltip__item_repair > li:nth-of-type(3) > span:last-child",
          regex: /(?<class>\D+) \D+ (?<level>\d+)/.source,
        }),
      material: z.string().meta({
        selector:
          "ul.db-tooltip__item_repair > li:nth-of-type(4) > span:last-child",
      }),
    }),
    extractable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector: "ul.db-tooltip__item-info__list > li:nth-of-type(1) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    projectable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector: "ul.db-tooltip__item-info__list > li:nth-of-type(2) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    desynthesizable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector: "ul.db-tooltip__item-info__list > li:nth-of-type(3) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
    dyeable: z
      .string()
      .transform((val) => /\b(?:yes|ja|oui|はい)\b|○/.test(val.toLowerCase()))
      .pipe(z.boolean())
      .meta({
        selector: "ul.db-tooltip__item-info__list > li:nth-of-type(4) > span",
        regex: /\b(?:yes|ja|oui|はい)\b|○/.source,
      }),
  }),
});
