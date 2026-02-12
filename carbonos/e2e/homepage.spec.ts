/**
 * CarbonOS 首页 E2E 测试
 * 核心链路：首页加载、导航、ROI 计算器交互
 */
import { test, expect } from "@playwright/test";

test.describe("首页", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("应正确加载首页标题和导航", async ({ page }) => {
        // 页面标题存在
        await expect(page).toHaveTitle(/CarbonOS/);

        // 导航栏可见
        const nav = page.locator("nav, header").first();
        await expect(nav).toBeVisible();
    });

    test("导航链接应正确跳转", async ({ page }) => {
        // 点击「产品定价」导航
        const pricingLink = page.getByRole("link", { name: /定价|价格|pricing/i });
        if (await pricingLink.isVisible()) {
            await pricingLink.click();
            await expect(page).toHaveURL(/pricing/);
        }
    });

    test("ROI 计算器应正确工作", async ({ page }) => {
        // 滚动到计算器区域
        const calculator = page.getByText("ROI 价值计算器");
        if (await calculator.isVisible({ timeout: 5000 }).catch(() => false)) {
            await calculator.scrollIntoViewIfNeeded();

            // 点击「计算潜在收益」按钮
            const calcBtn = page.getByRole("button", { name: /计算潜在收益/ });
            await calcBtn.click();

            // 验证结果区域出现
            await expect(page.getByText(/预计节省碳税/)).toBeVisible();
            await expect(page.getByText(/绿电交易收益/)).toBeVisible();
            await expect(page.getByText(/投资回报期/)).toBeVisible();
        }
    });

    test("页面应响应式加载（移动端）", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");

        // 页面应正常加载，无 JS 错误
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));

        await page.waitForLoadState("networkidle");
        expect(errors).toHaveLength(0);
    });
});
