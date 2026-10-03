import * as z from "zod/v4";

export const classjob = z
  .array(
    z.object({
      name: z
        .string()
        .transform((val) => val.match(/^([^[(]+)/)?.[1].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector: "div.character__job__name",
          regex: /^([^[(]+)/.source,
        }),
      level: z.coerce.number().meta({ selector: "div.character__job__level" }),
      exp: z
        .string()
        .transform((val) => {
          const groups = val.match(
            /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/,
          )?.groups;
          return Object.fromEntries(
            Object.entries(groups ?? {}).map(([key, str]) => {
              const digits = str.replace(/\D/g, "");
              return [key, digits ? parseInt(digits, 10) : 0];
            }),
          );
        })
        .pipe(
          z.object({
            current: z.number().default(0),
            max: z.number().default(0),
          }),
        )
        .meta({
          selector: "div.character__job__exp",
          regex: /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/.source,
        }),
    }),
  )
  .meta({
    selector: "div.ldst__bg > div.character__job__role:nth-of-type(-n + 6) li",
  });

export const field_operations = z
  .array(
    z.object({
      name: z.string().meta({ selector: "div.character__job__name-sp" }),
      level: z.coerce.number().meta({ selector: "div.character__job__level" }),
      exp: z
        .string()
        .transform((val) => {
          const groups = val.match(
            /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/,
          )?.groups;
          return Object.fromEntries(
            Object.entries(groups ?? {}).map(([key, str]) => {
              const digits = str.replace(/\D/g, "");
              return [key, digits ? parseInt(digits, 10) : 0];
            }),
          );
        })
        .pipe(
          z.object({
            current: z.number().default(0),
            max: z.number().default(0),
          }),
        )
        .meta({
          selector: "div.character__job__exp",
          regex: /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/.source,
        }),
    }),
  )
  .meta({
    selector:
      "div.ldst__bg > div.character__job__role:has(div.character__job__name-sp)",
  });

export const phantom_jobs = z
  .array(
    z.object({
      name: z.string().meta({ selector: "p.character__support_job__name" }),
      level: z
        .string()
        .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
        .pipe(z.coerce.number())
        .meta({
          selector: "p.character__support_job__level",
          regex: /(\d+)/.source,
        }),
      mastered: z
        .string()
        .pipe(z.coerce.boolean())
        .optional()
        .meta({ selector: "p.character__support_job__master" }),
      exp: z
        .string()
        .transform((val) => {
          const groups = val.match(
            /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/,
          )?.groups;
          return Object.fromEntries(
            Object.entries(groups ?? {}).map(([key, str]) => {
              const digits = str.replace(/\D/g, "");
              return [key, digits ? parseInt(digits, 10) : 0];
            }),
          );
        })
        .pipe(z.object({ current: z.number(), max: z.number() }))
        .optional()
        .meta({
          selector: "p.character__support_job__exp",
          regex: /^(?<current>[\d,. ]+) \/ (?<max>[\d,. ]+)/.source,
        }),
    }),
  )
  .meta({ selector: "div.character__support_job li" });
