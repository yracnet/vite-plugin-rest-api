import { InlineConfig } from "vite";

export type DirRoute = {
  dir: string;
  route: string;
  exclude?: string[];
};

export type Mapper = {
  name: string;
  method: string;
};

export type PluginConfig = {
  moduleId: string;
  server: string;
  handler: string;
  configure: string;
  serverFile: string;
  handlerFile: string;
  routersFile: string;
  configureFile: string;
  typesFile: string;
  dirs: DirRoute[];
  include: string[];
  exclude: string[];
  mapper: { [k: string]: string | false };
  mapperList: Mapper[];
  watcherList: string[];
  routeBase: string;
  root: string;
  cacheDir: string;
  disableBuild: boolean;
  clientOutDir: string;
  clientMinify: boolean | "terser" | "esbuild";
  clientBuild: (config: InlineConfig) => InlineConfig;
  serverOutDir: string;
  serverMinify: boolean | "terser" | "esbuild";
  serverBuild: (config: InlineConfig) => InlineConfig;
};

export type UserConfig = Partial<
  Omit<
    PluginConfig,
    | "serverFile"
    | "handlerFile"
    | "configureFile"
    | "routersFile"
    | "typesFile"
    | "mapperList"
    | "watcherList"
    | "config"
    | "routers"
  >
>;
