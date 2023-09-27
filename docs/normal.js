const githubButton = document.querySelector("header .navigation #github")
const downloadButton = document.querySelector("header .navigation #downloadRelease")
const discordButton = document.querySelector("header .navigation #discord")
const openIssueButton = document.querySelector("header .navigation #openIssue")

let key = {
  time: undefined,
  keys: "jasonlaubbhandsome"
}

let correct = false

let strings = ""

const pages = {
  page1: {
    board: document.querySelector("main .page1"),
    last: document.querySelector("main .page1 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page1 .buttons .nextPage .arrow")
  },
  page2: {
    board: document.querySelector("main .page2"),
    last: document.querySelector("main .page2 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page2 .buttons .nextPage .arrow")
  },
  page3: {
    board: document.querySelector("main .page3"),
    last: document.querySelector("main .page3 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page3 .buttons .nextPage .arrow")
  },
  page4: {
    board: document.querySelector("main .page4"),
    last: document.querySelector("main .page4 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page4 .buttons .nextPage .arrow")
  },
  page5: {
    board: document.querySelector("main .page5"),
    last: document.querySelector("main .page5 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page5 .buttons .nextPage .arrow")
  },
  page6: {
    board: document.querySelector("main .page6"),
    last: document.querySelector("main .page6 .buttons .lastPage .arrow"),
    next: document.querySelector("main .page6 .buttons .nextPage .arrow")
  }
}



githubButton.addEventListener("click", ev => {
  window.location = "https://github.com/jasonlaubb/Nokararos-AntiCheat"
})

downloadButton.addEventListener("click", ev => {
  window.location = "https://github.com/jasonlaubb/Nokararos-AntiCheat/releases"
})

discordButton.addEventListener("click", ev => {
  window.location = "https://discord.com/invite/CqZGXeRKPJ"
})

openIssueButton.addEventListener("click", ev => {
  window.location = "https://github.com/jasonlaubb/Nokararos-AntiCheat/issues/new/choose"
})



pages.page1.next.addEventListener("click", ev => nextPage(1))
pages.page2.last.addEventListener("click", ev => lastPage(2))
pages.page2.next.addEventListener("click", ev => nextPage(2))
pages.page3.last.addEventListener("click", ev => lastPage(3))
pages.page3.next.addEventListener("click", ev => nextPage(3))
pages.page4.last.addEventListener("click", ev => lastPage(4))
pages.page4.next.addEventListener("click", ev => nextPage(4))
pages.page5.last.addEventListener("click", ev => lastPage(5))
pages.page5.next.addEventListener("click", ev => nextPage(5))
pages.page6.last.addEventListener("click", ev => lastPage(6))

const nextPage = (nowPage) => {
  reset()

  pages[`page${nowPage + 1
    }`
  ].board.classList.add("selected")
}

const lastPage = (nowPage) => {
  reset()

  pages[`page${nowPage - 1
    }`
  ].board.classList.add("selected")
}

const reset = () => {
  for (const page of Object.entries(pages)) {
    page[
      1
    ].board.classList.remove("selected")
  }
}

document.addEventListener("keydown", ev => {
  if (!key.time) {
    key.time = Date.now()
  }

  if (ev.key == "Escape") {
    key.time = undefined

    strings = ""
  } else {
    strings += ev.key

    if (key.keys.startsWith(strings.toLowerCase())) {
      if (strings.toLowerCase() == key.keys) {
        window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

        key.time = undefined

        strings = ""
      }
    } else {
      key.time = undefined

      strings = ""
    }
  }
})

setInterval(() => {
  if (Date.now() - key.time > 10000) {
    key.time = undefined

    strings = ""
  }
})