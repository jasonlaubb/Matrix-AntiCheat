//@ts-check
//@ts-expect-error
window.$docsify = {
    el: "#app",
    repo: 'https://github.com/jasonlaubb/Matrix-AntiCheat',
    logo: '/images/logo.png',
    loadSidebar: true,
    name: "Matrix AntiCheat",
    hideSidebar: false,
    auto2top: true,
    coverpage: true,
    notFoundPage: true,
    onlyCover: true,
    nativeEmoji: true,
    relativePath: true,
    themeColor: "#383838",
    externalLinkRel: false,
    subMaxLevel: 2,
    search: {
        maxAge: 1,
        placeholder: {
          '/': 'Type to search',
        },
        noData: {
          '/': 'No Results Found',
        },
        depth: 6,
        hideOtherSidebarContent: true,
    },
}