import * as z from "zod/v4";

export const mounts = z
  .array(
    z.object({
      id: z.string().meta({ selector: "span[id]", attribute: "id" }),
      name: z.string().meta({ selector: "span.mount__name" }),
      icon: z.url().meta({ selector: "img", attribute: "src" }),
    })
  )
  .meta({
    selector: "div.character__minions > ul.mount__list > li",
  });
