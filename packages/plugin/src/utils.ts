import fs from "fs-extra";
import path from "slash-path";
import { fileURLToPath } from "url";
import { InlineConfig } from "vite";
import { Mapper, PluginConfig, UserConfig } from "./model";

export const assertConfig = (opts: UserConfig): PluginConfig => {
  let {
    moduleId = "@api",
    cacheDir = ".api",
    root = process.cwd(),
    server = path.join(cacheDir, "server.js"),
    handler = path.join(cacheDir, "handler.js"),
    configure = path.join(cacheDir, "configure.js"),
    routeBase = "api",
    dirs = [{ dir: "src/api", route: "", exclude: [] }],
    include = ["**/*.ts", "**/*.js"],
    exclude = [],
    mapper = {},
    clientOutDir = "dist/client",
    serverOutDir = "dist",
    serverMinify = false,
    clientMinify = true,
    clientBuild = (v: InlineConfig) => v,
    serverBuild = (v: InlineConfig) => v,
  } = opts;

  root = path.slash(root);
  dirs = dirs.map((it) => {
    it.dir = path.join(root, it.dir);
    return it;
  });

  mapper = {
    default: "use",
    GET: "get",
    PUT: "put",
    POST: "post",
    PATCH: "patch",
    DELETE: "delete",
    // Overwrite
    ...mapper,
  };
  routeBase = path.join("/", routeBase);
  clientOutDir = path.join(root, clientOutDir);
  serverOutDir = path.join(root, serverOutDir);
  cacheDir = path.join(root, cacheDir);
  const serverFile = path.join(root, server);
  const handlerFile = path.join(root, handler);
  const routersFile = path.join(cacheDir, "routers.js");
  const typesFile = path.join(cacheDir, "types.d.ts");
  const configureFile = path.join(root, configure);

  const mapperList = Object.entries(mapper)
    .filter((it) => it[1])
    .map(([name, method]) => {
      return <Mapper>{
        name,
        method,
      };
    });
  const watcherList = dirs.map((it) => it.dir);
  watcherList.push(cacheDir);
  watcherList.push(serverFile);
  watcherList.push(handlerFile);

  return {
    moduleId,
    server,
    handler,
    configure,
    root,
    serverFile,
    handlerFile,
    routersFile,
    typesFile,
    configureFile,
    routeBase,
    dirs,
    include,
    exclude,
    mapper,
    mapperList,
    watcherList,
    serverOutDir,
    clientOutDir,
    cacheDir,
    serverMinify,
    clientMinify,
    serverBuild,
    clientBuild,
  };
};

export const getPluginDirectory = () => {
  if (typeof __dirname === "undefined") {
    const filename = fileURLToPath(import.meta.url);
    return path.dirname(filename);
  } else {
    return __dirname;
  }
};

export const copyAPIDirectory = (
  origin: string,
  target: string,
  files: string[],
  oldId = "",
  newId = ""
) => {
  let apiOrigin = path.resolve(origin, "../.api");
  if (!fs.existsSync(apiOrigin)) {
    apiOrigin = path.resolve(origin, "../../.api");
  }
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(target, { recursive: true });

  files.forEach((file) => {
    const sourceFilePath = path.resolve(apiOrigin, file);
    const targetFilePath = path.resolve(target, file);
    if (oldId !== newId) {
      let fileContent = fs.readFileSync(sourceFilePath, "utf-8");
      fileContent = fileContent.replace(new RegExp(oldId, "g"), newId);
      fs.writeFileSync(targetFilePath, fileContent, "utf-8");
    } else {
      fs.copySync(sourceFilePath, targetFilePath, { overwrite: true });
    }
  });
};