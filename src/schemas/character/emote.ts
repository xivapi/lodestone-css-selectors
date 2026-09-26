import * as z from "zod/v4";

export const emotes = z
  .array(
    z.object({
      id: z.string().meta({ selector: "span[id]", attribute: "id" }),
      name: z.string().meta({ selector: "span.emote__name" }),
      icon: z.url().meta({ selector: "img", attribute: "src" }),
    })
  )
  .meta({
    selector: "div.character__emote > ul.emote__list > li",
  });
