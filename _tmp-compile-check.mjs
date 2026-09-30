/**
 * 本地验证脚手架（不属于站点改动）：
 * Astro CLI 在当前 node_modules 下加载不了配置，改用编译器本身
 * （@astrojs/compiler-rs）编译两个改动的页面，确认语法能过、
 * 座右铭的条件渲染与模板结构符合预期。
 */
import { readFileSync } from "node:fs";
import { transform } from "@astrojs/compiler-rs";

const files = [
  "D:\\code\\github_index\\Yzk258.github.io\\src\\pages\\index.astro",
  "D:\\code\\github_index\\Yzk258.github.io\\src\\pages\\about.astro",
];

let failed = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  try {
    const result = await transform(source, { filename: file, sourcemap: "none" });
    const diags = result.diagnostics ?? [];
    const errors = diags.filter(d => d.severity === 1);
    console.log(`\n=== ${file.split("\\").pop()} ===`);
    console.log(`  诊断: ${diags.length} 条（错误 ${errors.length}）`);
    for (const d of diags) {
      console.log(`    [sev ${d.severity}] ${d.text}`);
    }
    if (errors.length) failed++;

    // 前端脚本里应出现 motto 的条件渲染
    const js = result.code ?? "";
    console.log(`  前端代码含 config.site.motto: ${js.includes("motto") ? "是" : "否"}`);
    const styles = (result.css ?? []).map(s => s.toString?.() ?? String(s));
    const cssText = styles.join("\n");
    if (cssText) console.log(`  组件样式片段: ${cssText.slice(0, 200)}`);
  } catch (err) {
    failed++;
    console.log(`\n=== ${file.split("\\").pop()} ===`);
    console.log("  编译失败:", err.message);
  }
}

console.log(`\n================ ${failed === 0 ? "两个页面编译通过 ✅" : `有 ${failed} 个页面编译失败 ❌`} ================`);
process.exitCode = failed === 0 ? 0 : 1;
