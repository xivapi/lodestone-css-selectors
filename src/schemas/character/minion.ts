import * as z from "zod/v4";

export const minions = z
  .array(
    z.object({
      id: z.string().meta({ selector: "span[id]", attribute: "id" }),
      name: z.string().meta({ selector: "span.minion__name" }),
      icon: z.url().meta({ selector: "img", attribute: "src" }),
    })
  )
  .meta({
    selector: "div.character__minions > ul.minion__list > li",
  });
