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
          const parts = val
            .split("/")
            .map((str) => Number(str?.replace(/\D/g, "")));
          return parts.some((val) => val === 0) ? null : parts;
        })
        .pipe(z.tuple([z.number(), z.number()]).nullable())
        .meta({ selector: "div.character__job__exp" }),
    })
  )
  .meta({
    selector: "div.ldst__bg > div.character__job__role:nth-of-type(-n + 6) li",
  });

export const zones = z.object({
  eureka: z.object({
    label: z.string().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(7) div.character__job__name-sp",
    }),
    level: z.coerce.number().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(7) div.character__job__level",
    }),
    exp: z
      .string()
      .transform((val) => {
        const parts = val
          .split("/")
          .map((str) => Number(str?.replace(/\D/g, "")));
        return parts.some((val) => val === 0) ? null : parts;
      })
      .pipe(z.tuple([z.number(), z.number()]).nullable())
      .meta({
        selector:
          "div.ldst__bg > div.character__job__role:nth-of-type(7) div.character__job__exp",
      }),
  }),
  bozja: z.object({
    label: z.string().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(8) div.character__job__name-sp",
    }),
    level: z.coerce.number().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(8) div.character__job__level",
    }),
    exp: z
      .string()
      .transform((val) => {
        const parts = val
          .split("/")
          .map((str) => Number(str?.replace(/\D/g, "")));
        return parts.some((val) => val === 0) ? null : parts;
      })
      .pipe(z.tuple([z.number(), z.number()]).nullable())
      .meta({
        selector:
          "div.ldst__bg > div.character__job__role:nth-of-type(8) div.character__job__exp",
      }),
  }),
  occult_cresent: z.object({
    label: z.string().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(9) div.character__job__name-sp",
    }),
    level: z.coerce.number().meta({
      selector:
        "div.ldst__bg > div.character__job__role:nth-of-type(8) div.character__job__level",
    }),
    exp: z
      .string()
      .transform((val) => {
        const parts = val
          .split("/")
          .map((str) => Number(str?.replace(/\D/g, "")));
        return parts.some((val) => val === 0) ? null : parts;
      })
      .pipe(z.tuple([z.number(), z.number()]).nullable())
      .meta({
        selector:
          "div.ldst__bg > div.character__job__role:nth-of-type(8) div.character__job__exp",
      }),
  }),
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
      exp: z
        .string()
        .transform((val) => {
          const parts = val
            .split("/")
            .map((str) => Number(str?.replace(/\D/g, "")));
          return parts.every((val) => val === 0) ? null : parts;
        })
        .pipe(z.tuple([z.number(), z.number()]).nullable())
        .meta({
          selector:
            "p.character__support_job__exp,p.character__support_job__master",
        }),
    })
  )
  .meta({ selector: "div.character__support_job li" });
