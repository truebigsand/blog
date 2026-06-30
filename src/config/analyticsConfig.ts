import type { AnalyticsConfig } from "../types/analyticsConfig";

export const analyticsConfig: AnalyticsConfig = {
	// Google Analytics ID
	googleAnalyticsId: "",
	// Microsoft Clarity ID — 原 Hexo 博客
	microsoftClarityId: "n4oq003ka0",
	// Umami 统计配置 — 自托管
	umamiAnalytics: {
		// Umami Website ID — 原 Hexo 博客
		websiteId: "52e85673-ab5d-4548-bad7-779a4dd96e69",
		// Umami JS地址 — 自建
		scriptUrl: "https://umami.truebigsand.top/asdfghjkl",
		// Umami 会话回放脚本地址
		replaysScriptUrl: "",
		// 是否追踪出站链接
		trackOutboundLinks: true,
		// 是否收集浏览器性能指标
		collectWebVitals: false,
		// 会话回放配置
		replays: {
			// 是否启用会话回放
			enabled: false,
			// 录制会话采样率，范围 0-1
			sampleRate: 0.15,
			// 隐私遮罩级别
			maskLevel: "moderate",
			// 单次录制最大时长（毫秒）
			maxDuration: 300000,
			// 需要排除录制的元素 CSS 选择器
			blockSelector: "",
		},
	},
	// 51la 统计配置
	la51Analytics: {
		Id: "",
		sdkUrl: "",
		ck: "",
		autoTrack: false,
		hashMode: false,
		screenRecord: true,
	},
};
