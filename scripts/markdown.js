let replacements = {
    bold: {
        regex: /\*\*(\S.+?\S|\S|.)\*\*/g,
        rule: (x, content) => {
            return `<strong>${content}</strong>`
        }
    },
    italic: {
        regex: /\*(\S.+?\S|\S|.)\*/g,
        rule: (x, content) => {
            return `<em>${content}</em>`
        }
    },
    underline: {
        regex: /__(.+?)__/g,
        rule: (x, content) => {
            return `<u>${content}</u>`
        }
    },
    strikethrough: {
        regex: /~~(.+?)~~/g,
        rule: (x, content) => {
            return `<s>${content}</s>`
        }
    },
    spoiler: {
        regex: /\|\|(.+?)\|\|/g,
        rule: (x, content) => {
            return `<span class="spoilerHidden" onclick="spoilerReveal (this)"><span style="opacity: 0">${content}</span></span>`
        }
    },
    code: {
        regex: /```(.+?)```/g,
        rule: (x, content) => {
            return `<pre><code class="full">${content}</code></pre>`
        }
    },
    codeInline: {
        regex: /`([^`]+?)`/g,
        rule: (x, content) => {
            return `<code class="inline">${content}</code>`
        }
    },
    link: {
        regex: /(?:(?:https?):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gi,
        rule: (x) => {
            return `<a target="_blank" href="${x}" class="url">${x}</a>`
        }
    },
    emoji: {
        regex: /(\\)?:\S*?:/g,
        rule: (x) => {
            if (escape && escape === '\\') return x
            return emojis[x] || x
        }
    },
    blank: {
        regex: /\*\* *?\*\*/g,
        rule: '\u200b'
    },
    mention: {
        regex: /(<@!?\d{18}>)|(@\S+)|(<#!?\d{18}>)|(#\S+)/g,
        rule: (x) => {
            return `<span class="mention">${x}</span>`
        }
    }
}

function markdown (text) {
    for (let r in replacements) text = text.replace(replacements[r].regex, replacements[r].rule)
    return getLink(text)
}
function getEmoji (text) {
    return text.replace(replacements.emoji.regex, replacements.emoji.rule)
}
function getLink (text) {
    return text.replace(/\[([^()]+?)]\(<a .+?>(.+?)<\/a>\)/g, (content, name, link) => {
        return `<a href="${link}" class="url">${name}</a>`
    })
}
function spoilerReveal (element) {
    element.className = "spoiler"
    element.firstChild.style.opacity = "1"
}