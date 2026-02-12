const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
    // 测试环境
    testEnvironment: "jest-environment-jsdom",

    // 模块路径别名 (与 tsconfig 保持一致)
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    // 测试文件匹配
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
        "<rootDir>/src/**/*.test.{ts,tsx}",
    ],

    // 忽略路径（避免 Haste 命名冲突）
    modulePathIgnorePatterns: ["<rootDir>/.next/"],

    // 覆盖率
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/layout.tsx",
        "!src/**/page.tsx",
    ],
};

module.exports = createJestConfig(customJestConfig);
