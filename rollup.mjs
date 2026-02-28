import { rollup } from "rollup";
import path from "path";
import fs from "fs";
import terser from '@rollup/plugin-terser';

async function bundleJS() {
    console.log("Start bundling");
    const now = Date.now();
    // Remove previous build artifacts
    fs.unlink("dist/tsconfig.tsbuildinfo", (_error) => {});
    const bundle = await rollup({
        input: path.resolve("dist/main.js"),
        external: ["@minecraft/server", "@minecraft/server-ui", "../data/property", "./data/config"],
        plugins: [terser({
            sourceMap: false,
            compress: true,
            format: {
                comments: false,
            }
        })]
    });

    await bundle.write({
        file: path.resolve("bp/scripts/main.js"),
        format: "es",
        sourcemap: false,
        compact: true,
        preserveModules: false,
        strict: false,
    });

    console.log(`Bundling finished (${Date.now() - now}ms)`);
}
fs.copyFileSync("dist/data/property.js", "bp/scripts/data/property.js");
bundleJS().catch(console.error);