import * as z from "zod/v4";

export const achievements = z
  .array(
    z.object({
      id: z
        .string()
        .transform(
          (val) =>
            val
              .match(
                /lodestone\/character\/\d+\/achievement\/detail\/(\d+)/
              )?.[1]
              .trim() ?? val.trim()
        )
        .pipe(z.coerce.number())
        .meta({
          selector: "a",
          attribute: "href",
          regex: /lodestone\/character\/\d+\/achievement\/detail\/(\d+)/.source,
        }),
      name: z
        .string()
        .transform((val) => val.match(/"(\D+)"/)?.[1].trim() ?? val.trim())
        .pipe(z.string())
        .meta({
          selector: "p.entry__activity__txt",
          regex: /"(\D+)"/.source,
        }),
      icon: z.url().meta({ selector: "img", attribute: "src" }),
      obtained_at: z
        .string()
        .transform((val) => {
          const match = val.match(/ldst_strftime\((\d+)/);
          return match ? parseInt(match[1], 10) * 1000 : val;
        })
        .pipe(z.coerce.date())
        .meta({
          selector: "time.entry__activity__time > script",
          regex: /ldst_strftime\((\d+)/.source,
        }),
    })
  )
  .meta({ selector: "div.ldst__bg li.entry" });
