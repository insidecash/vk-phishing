/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@sapper/app" {
  export declare function goto(
    href: string,
    options?: {
      replaceState?: boolean;
      noscroll?: boolean;
    }
  ): Promise<void>;
  export declare function prefetch(href: string): Promise<void>;
  export declare function prefetchRoutes(routes: string[]): Promise<void>;
  export declare function start(options: {
    target: HTMLElement;
  }): Promise<void>;
}
declare module "@sapper/server" {
  export declare function middleware(options: {
    ignore?: any;
    session?: (
      request: import("polka").Request,
      response: any
    ) => Record<string, any>;
  }): import("polka").Middleware;
}
declare module "@sapper/service-worker" {
  export const timestamp: number;
  export const files: string[];
  export const shell: string[];
  export const routes: ({ pattern: RegExp } & Record<string, any>)[];
}
