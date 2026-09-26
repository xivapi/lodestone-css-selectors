import * as z from "zod/v4";

export const facewear = z
  .array(
    z.object({
      id: z.string().meta({ selector: "span[id]", attribute: "id" }),
      name: z.string().meta({ selector: "span.faceaccessory__name" }),
      icon: z.url().meta({ selector: "img", attribute: "src" }),
    })
  )
  .meta({
    selector: "div.character__faceaccessory > ul.faceaccessory__list > li",
  });
