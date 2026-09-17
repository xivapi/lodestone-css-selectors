declare module "zod" {
  interface GlobalMeta {
    selector: string;
    attribute?: string;
    regex?: string;
  }
}

export {};
