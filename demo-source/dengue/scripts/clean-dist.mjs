import { rm } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const outputDirectory = resolve(projectDirectory, "dist");
const relativeOutput = relative(projectDirectory, outputDirectory);

if (
  relativeOutput !== "dist"
  || relativeOutput.startsWith("..")
  || isAbsolute(relativeOutput)
) {
  throw new Error("Diretório de build inválido.");
}

await rm(outputDirectory, { recursive: true, force: true });
