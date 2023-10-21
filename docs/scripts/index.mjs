const menu = document.querySelector("header .menu")
const navbar = document.querySelector("header .navbar")
const homeButton = document.querySelector("header .navbar #home")
const githubButton = document.querySelector("header .navbar #github")
const downloadReleaseButton = document.querySelector("header .navbar #downloadRelease")
const developersButton = document.querySelector("header .navbar #developers")
const discordButton = document.querySelector("header .navbar #discord")

const goToGithub = document.querySelector("section.github .board .goToGithub")
const goToDownloadRelease = document.querySelector("section.downloadRelease .board .goToDownloadRelease")
const goToDiscord = document.querySelector("section.discord .board .discord .join")

const mainParagraph = {
  environment: {
    items: document.querySelector("section.home .allParagraph .environment"),
    pageChange: {
      next: document.querySelector("section.home .allParagraph .environment .pageChanger .nextPage"),
      last: document.querySelector("section.home .allParagraph .environment .pageChanger .lastPage")
    }
  },
  hackerDetection: {
    items: document.querySelector("section.home .allParagraph .hackerDetection"),
    pageChange: {
      next: document.querySelector("section.home .allParagraph .hackerDetection .pageChanger .nextPage"),
      last: document.querySelector("section.home .allParagraph .hackerDetection .pageChanger .lastPage")
    }
  },
  openSource: {
    items: document.querySelector("section.home .allParagraph .openSource"),
    pageChange: {
      next: document.querySelector("section.home .allParagraph .openSource .pageChanger .nextPage"),
      last: document.querySelector("section.home .allParagraph .openSource .pageChanger .lastPage")
    }
  },
  githubContributors: {
    items: document.querySelector("section.home .allParagraph .githubContributors"),
    pageChange: {
      next: document.querySelector("section.home .allParagraph .githubContributors .pageChanger .nextPage"),
      last: document.querySelector("section.home .allParagraph .githubContributors .pageChanger .lastPage")
    }
  },
  specialThanks: {
    items: document.querySelector("section.home .allParagraph .specialThanks"),
    pageChange: {
      next: document.querySelector("section.home .allParagraph .specialThanks .pageChanger .nextPage"),
      last: document.querySelector("section.home .allParagraph .specialThanks .pageChanger .lastPage")
    }
  }
}

window.scroll(0, 0)

menu.addEventListener("click", ev => {
  navbar.classList.toggle("opened")
})

homeButton.addEventListener("click", ev => {
  window.scroll(0, 0)
})

githubButton.addEventListener("click", ev => {
  window.scroll(0, window.innerHeight - window.innerHeight / 4)
})

downloadReleaseButton.addEventListener("click", ev => {
  window.scroll(0, window.innerHeight + window.innerHeight / 2)
})

developersButton.addEventListener("click", ev => {
  window.scroll(0, window.innerHeight * 2 + window.innerHeight / 3)
})

discordButton.addEventListener("click", ev => {
  window.scroll(0, window.innerHeight * 3 + window.innerHeight / 4)
})

window.addEventListener("resize", ev => {
  if (window.innerWidth >= 950) {
    navbar.classList.remove("opened")
  }
})

const mainParagraphReset = () => {
  mainParagraph.environment.items.classList.remove("selected")
  mainParagraph.hackerDetection.items.classList.remove("selected")
  mainParagraph.openSource.items.classList.remove("selected")
  mainParagraph.githubContributors.items.classList.remove("selected")
  mainParagraph.specialThanks.items.classList.remove("selected")
}

const mainParagraphNextPage = (page) => {
  mainParagraphReset()
  Object.entries(mainParagraph)[page + 1][1].items.classList.add("selected")
}

const mainParagraphLastPage = (page) => {
  mainParagraphReset()
  Object.entries(mainParagraph)[page - 1][1].items.classList.add("selected")
}

mainParagraph.environment.pageChange.next.addEventListener("click", ev => mainParagraphNextPage(0))
mainParagraph.hackerDetection.pageChange.last.addEventListener("click", ev => mainParagraphLastPage(1))
mainParagraph.hackerDetection.pageChange.next.addEventListener("click", ev => mainParagraphNextPage(1))
mainParagraph.openSource.pageChange.last.addEventListener("click", ev => mainParagraphLastPage(2))
mainParagraph.openSource.pageChange.next.addEventListener("click", ev => mainParagraphNextPage(2))
mainParagraph.githubContributors.pageChange.last.addEventListener("click", ev => mainParagraphLastPage(3))
mainParagraph.githubContributors.pageChange.next.addEventListener("click", ev => mainParagraphNextPage(3))
mainParagraph.specialThanks.pageChange.last.addEventListener("click", ev => mainParagraphLastPage(4))

goToGithub.addEventListener("click", ev => {
  window.location = "https://github.com/jasonlaubb/Matrix-AntiCheat"
})

goToDownloadRelease.addEventListener("click", ev => {
  window.location = "https://github.com/jasonlaubb/Matrix-AntiCheat/releases"
})

goToDiscord.addEventListener("click", ev => {
  window.location = "https://discord.gg/PCAVAxj9Nj"
})
