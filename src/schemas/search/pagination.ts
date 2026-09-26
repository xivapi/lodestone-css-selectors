import * as z from "zod/v4";

export const pagination = z.object({
  total: z
    .string()
    .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
    .pipe(z.coerce.number())
    .meta({ selector: "div.parts__fraction", regex: /(\d+)/.source }),
  next: z
    .string()
    .transform((val) => val.match(/(\d+)/)?.[1].trim() ?? val.trim())
    .pipe(z.coerce.number())
    .meta({ selector: "div.btn__next > a", regex: /(\d+)/.source }),
});
