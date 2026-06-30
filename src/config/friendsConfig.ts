import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（friends.mdx 中的内容）
	showCustomContent: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "哔哩哔哩",
		imgurl: "https://s2.loli.net/2023/04/02/wD2jy7kH9fbdJpU.png",
		desc: "哔哩哔哩",
		siteurl: "https://www.bilibili.com/",
		tags: ["视频"],
		weight: 10,
		enabled: true,
	},
	{
		title: "南师附中2023级开发者社教材",
		imgurl: "https://p1.ssl.qhimg.com/t01e25028e1da5867ce.jpg",
		desc: "南师附中2023级开发者社教材",
		siteurl: "https://nsfz-developers.github.io/club-textbook-2023/textbook.html",
		tags: ["教育"],
		weight: 9,
		enabled: true,
	},
	{
		title: "KaTeX Supported Functions",
		imgurl: "https://katex.org/img/katex-logo.svg",
		desc: "Katex支持的功能",
		siteurl: "https://katex.org/docs/supported.html",
		tags: ["工具"],
		weight: 8,
		enabled: true,
	},
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
