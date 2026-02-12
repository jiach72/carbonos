import { defineConfig, devices } from "@playwright/test";

/**
 * CarbonOS E2E 测试配置
 * 运行方式：npx playwright test
 */
export default defineConfig({
    // 测试目录
    testDir: "./e2e",

    // 每个测试的超时时间
    timeout: 30_000,

    // 测试运行配置
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    // 报告器
    reporter: process.env.CI ? "github" : "html",

    // 全局配置
    use: {
        // 基础 URL（需先启动 dev server）
        baseURL: "http://localhost:3000",

        // 自动截图和追踪
        screenshot: "only-on-failure",
        trace: "on-first-retry",

        // 浏览器配置
        locale: "zh-CN",
        timezoneId: "Asia/Shanghai",
    },

    // 仅 Chromium（开发阶段轻量化）
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    // 自动启动 dev server
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
