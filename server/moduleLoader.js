import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadModuleRoutes(app) {
  const modulesPath = path.join(__dirname, "./src/modules");
  const modules = fs.readdirSync(modulesPath);

  for (const moduleName of modules) {
    const moduleRoutesPath = path.join(modulesPath, moduleName, "routes");
    if (!fs.existsSync(moduleRoutesPath)) continue;

    const routeFiles = fs
      .readdirSync(moduleRoutesPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of routeFiles) {
      const routePath = path.join(moduleRoutesPath, file);
      const fileUrl = pathToFileURL(routePath).href;
      const route = await import(fileUrl);

      const routePrefix = `/api/${moduleName}/${file
        .replace(/Routes\.js$/i, "")
        .toLowerCase()}`;

      app.use(routePrefix, route.default);
    }
  }
}
