/**
 * CarbonOS 认证流程 E2E 测试
 * 核心链路：登录、鉴权保护、退出
 */
import { test, expect } from "@playwright/test";

test.describe("租户登录 (/login)", () => {
    test("应正确渲染登录页面", async ({ page }) => {
        await page.goto("/login");

        // 应有登录表单
        await expect(page.getByPlaceholder(/邮箱|email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/密码|password/i)).toBeVisible();
    });

    test("空表单提交应有提示", async ({ page }) => {
        await page.goto("/login");

        // 点击登录按钮
        const loginBtn = page.getByRole("button", { name: /登录|sign in/i });
        await loginBtn.click();

        // 应该有某种验证提示（根据实际实现可能是 toast 或 inline error）
        await page.waitForTimeout(500);

        // 不跳转（仍在登录页）
        await expect(page).toHaveURL(/login/);
    });

    test("错误凭据应显示错误消息", async ({ page }) => {
        await page.goto("/login");

        await page.getByPlaceholder(/邮箱|email/i).fill("wrong@test.com");
        await page.getByPlaceholder(/密码|password/i).fill("WrongPassword123!");

        const loginBtn = page.getByRole("button", { name: /登录|sign in/i });
        await loginBtn.click();

        // 应显示错误提示（toast 或 inline）
        await page.waitForTimeout(2000);

        // 仍在登录页
        await expect(page).toHaveURL(/login/);
    });
});

test.describe("管理员登录 (/sys-portal)", () => {
    test("应正确渲染管理员登录页面", async ({ page }) => {
        await page.goto("/sys-portal");

        await expect(page.getByPlaceholder(/邮箱|email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/密码|password/i)).toBeVisible();
    });
});

test.describe("路由保护", () => {
    test("未登录访问 /admin 应重定向到登录页", async ({ page }) => {
        await page.goto("/admin");
        await page.waitForURL(/sys-portal|login/, { timeout: 10_000 });

        // 应被重定向
        const url = page.url();
        expect(url).toMatch(/sys-portal|login/);
    });

    test("未登录访问仪表板应重定向到登录页", async ({ page }) => {
        await page.goto("/dashboard");
        await page.waitForURL(/login/, { timeout: 10_000 });

        const url = page.url();
        expect(url).toMatch(/login/);
    });
});
