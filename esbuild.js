const { Command } = require("commander");
const esbuild = require("esbuild");

const program = new Command();

let format = "esm";
let platform = "browser";

program
  .option("--type <char>", "生成指定模块的代码")
  .option("--target <char>", "目标平台");

const { type, target } = program.parse().opts();

if (type) {
  format = type;
}

if (target) {
  platform = target;
}

esbuild.build({
  entryPoints: ["src/index.ts"],
  outdir: `./dist/${format}`,
  bundle: true,
  format,
  platform,
  external: ["@tarojs/taro"],
});
