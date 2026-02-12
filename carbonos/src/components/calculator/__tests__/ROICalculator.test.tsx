/**
 * ROICalculator 组件测试
 * 验证：渲染、用户交互、计算逻辑
 */

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ROICalculator } from "../ROICalculator";

// Mock lucide-react 图标组件
jest.mock("lucide-react", () => ({
    Calculator: () => <span data-testid="icon-calculator" />,
    TrendingUp: () => <span data-testid="icon-trending" />,
    Leaf: () => <span data-testid="icon-leaf" />,
    Clock: () => <span data-testid="icon-clock" />,
    ChevronRight: () => <span data-testid="icon-chevron" />,
}));

describe("ROICalculator", () => {
    it("应正确渲染标题和表单", () => {
        render(<ROICalculator />);

        expect(screen.getByText("ROI 价值计算器")).toBeInTheDocument();
        expect(screen.getByText("行业类型")).toBeInTheDocument();
        expect(screen.getByText(/年用电量/)).toBeInTheDocument();
        expect(screen.getByText("主要出口地区")).toBeInTheDocument();
    });

    it("应包含计算按钮", () => {
        render(<ROICalculator />);
        expect(screen.getByText("计算潜在收益")).toBeInTheDocument();
    });

    it("点击计算后应显示结果", () => {
        render(<ROICalculator />);

        // 初始不显示结果
        expect(screen.queryByText(/预计节省碳税/)).toBeNull();

        // 点击计算
        fireEvent.click(screen.getByText("计算潜在收益"));

        // 应显示结果卡片
        expect(screen.getByText(/预计节省碳税/)).toBeInTheDocument();
        expect(screen.getByText(/绿电交易收益/)).toBeInTheDocument();
        expect(screen.getByText(/投资回报期/)).toBeInTheDocument();
    });

    it("结果中应显示推荐方案", () => {
        render(<ROICalculator />);
        fireEvent.click(screen.getByText("计算潜在收益"));
        // 推荐方案区域应展示
        expect(screen.getByText(/推荐方案/)).toBeInTheDocument();
        expect(screen.getByText(/年碳排放/)).toBeInTheDocument();
    });

    it("点击获取报告后应显示 Lead 表单", () => {
        render(<ROICalculator />);

        // 先计算
        fireEvent.click(screen.getByText("计算潜在收益"));

        // 初始不显示表单
        expect(screen.queryByText("留下联系方式，获取详细报告")).toBeNull();

        // 点击获取报告
        fireEvent.click(screen.getByText(/获取完整诊断报告/));

        // 应显示 lead capture 表单
        expect(screen.getByText("留下联系方式，获取详细报告")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("姓名")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("公司名称")).toBeInTheDocument();
    });

    it("应显示所有行业选项", () => {
        render(<ROICalculator />);

        const industryOptions = ["制造业", "化工", "电子", "纺织", "食品加工", "建材"];
        industryOptions.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it("应显示所有出口地区选项", () => {
        render(<ROICalculator />);

        const regionOptions = ["欧盟", "美国", "东南亚", "无出口/内销"];
        regionOptions.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it("底部应有免责声明", () => {
        render(<ROICalculator />);
        expect(screen.getByText(/以上数据为基于行业平均值的估算结果/)).toBeInTheDocument();
    });
});
