import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,
	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		children: [
			// 归档
			LinkPresets.Archive,

			// 分类
			LinkPresets.Categories,

			// 标签
			LinkPresets.Tags,
		],
	});

	// 友链
	links.push(LinkPresets.Friends);

	// 留言板
	// links.push(LinkPresets.Guestbook);

	// 我的及其子菜单
	links.push({
		name: "追番",
		url: "#",
		icon: "material-symbols:live-tv",
		children: [
			// 相册
			// LinkPresets.Gallery,
			LinkPresets.Bangumi,
			// B站追番
			LinkPresets.Anime,
		],
	});

	// 关于及其子菜单
	// links.push({
	// 	name: "关于",
	// 	url: "#",
	// 	icon: "material-symbols:info",
	// 	children: [
	// 		// 打赏
	// 		LinkPresets.Sponsor,

	// 		// 关于页面
	// 		LinkPresets.About,
	// 	],
	// });
	links.push(LinkPresets.About);

	// 自定义导航栏链接
	links.push({
		name: "链接",
		url: "#",
		icon: "material-symbols:link",
		// 子菜单
		children: [
			{
				name: "GitHub",
				url: "https://github.com/truebigsand",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "B站",
				url: "https://space.bilibili.com/362378992",
				external: true,
				icon: "fa7-brands:bilibili",
			},
		],
	});

	links.push({
		name: "南师附中开发者社2023级社团教材",
		url: "/posts/developer-club-textbook-2023/",
		external: false,
		icon: "material-symbols:book",
	});

	links.push({
		name: "🚇开往",
		url: "https://www.travellings.cn/go.html",
		external: true,
		icon: "fa7-solid:train-subway"
	})

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		url: "/",
		icon: "material-symbols:home",
	},
	Archive: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "标签",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	Sponsor: {
		name: "打赏",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "关于我",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Bangumi: {
		name: "番组计划 Bangumi",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	Gallery: {
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Anime: {
		name: "Bilibili",
		url: "/anime/",
		icon: "fa7-brands:bilibili",
		pageKey: "anime",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
