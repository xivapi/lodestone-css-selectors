import * as z from "zod/v4";

export const pagination = z
  .object({
    start: z.string().meta({ selector: "a.btn__pager__prev--all" }),
    previous: z.string().meta({ selector: "a.btn__pager__prev" }),
    current: z
      .string()
      .regex(/(\d+)/g)
      .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
      .pipe(z.number())
      .meta({ selector: "a.btn__pager__current" }),
    pages: z
      .string()
      .regex(/(\d+)/g)
      .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
      .pipe(z.number())
      .meta({ selector: "a.btn__pager__current" }),
    next: z.string().meta({ selector: "a.btn__pager__next" }),
    end: z.string().meta({ selector: "a.btn__pager__next--all" }),
  })
  .meta({ selector: "ul.btn__pager" });
