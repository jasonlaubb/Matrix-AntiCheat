//@ts-check
//@ts-expect-error
window.$docsify = {
    name: "Matrix AntiCheat",
    repo: 'https://github.com/jasonlaubb/Matrix-AntiCheat',
    loadSidebar: true,
    logo: './logo.png',
    coverpage: "cover.md",
    onlyCover: true,
    subMaxLevel: 2,
    search: {
        paths: 'auto',
        noData: 'No Result was found.',
        placeholder: "Search",
        depth: 6,
        hideOtherSidebarContent: false
    },
}