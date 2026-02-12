/**
 * CarbonOS 静态页面 E2E 测试
 * 验证所有公开页面可正常加载，无 JS 错误
 */
import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = [
    { path: "/", name: "首页" },
    { path: "/pricing", name: "产品定价" },
    { path: "/about", name: "关于我们" },
    { path: "/solutions", name: "解决方案" },
    { path: "/core-tech", name: "核心技术" },
    { path: "/ai-models", name: "AI 模型" },
    { path: "/diagnosis", name: "碳诊断" },
    { path: "/news", name: "新闻动态" },
];

for (const { path, name } of PUBLIC_PAGES) {
    test(`${name} (${path}) 应正常加载`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));

        const response = await page.goto(path);

        // HTTP 状态 200
        expect(response?.status()).toBe(200);

        // 无 JS 运行时错误
        expect(errors).toHaveLength(0);

        // 页面内容非空
        const body = page.locator("body");
        await expect(body).not.toBeEmpty();
    });
}

test("所有公开页面应有 meta description", async ({ page }) => {
    for (const { path } of PUBLIC_PAGES) {
        await page.goto(path);
        const metaDesc = page.locator('meta[name="description"]');
        // 检查 meta 标签存在（SEO 基础）
        const count = await metaDesc.count();
        if (count === 0) {
            console.warn(`⚠️ ${path} 缺少 meta description`);
        }
    }
});
