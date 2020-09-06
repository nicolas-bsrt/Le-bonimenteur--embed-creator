let replacements = {
    quote: {
        regex: /(?<=\n|^)>.+(?:(?:\n>).+)*\n?/g,
        rule : (x) => `<div class="blockquoteContainer"><div class="blockquoteLine"></div><blockquote>${x.replace(/>/g, '')}</blockquote></div>`
    },
    bold: {
        regex: /\*\*(\S.+?\S|\S|.)\*\*/g,
        rule: (x, content) => `<strong>${content}</strong>`
    },
    italic: {
        regex: /\*(\S.+?\S|\S|.)\*/g,
        rule: (x, content) => `<em>${content}</em>`
    },
    underline: {
        regex: /__(.+?)__/g,
        rule: (x, content) => `<u>${content}</u>`
    },
    strikethrough: {
        regex: /~~(.+?)~~/g,
        rule: (x, content) => `<s>${content}</s>`
    },
    spoiler: {
        regex: /\|\|(.+?)\|\|/g,
        rule: (x, content) => `<span class="spoilerHidden" onclick="spoilerReveal (this)"><span style="opacity: 0">${content}</span></span>`
    },
    code: {
        regex: /```(.+?)```/g,
        rule: (x, content) => `<pre><code class="full">${content}</code></pre>`
    },
    codeInline: {
        regex: /`([^`]+?)`/g,
        rule: (x, content) => `<code class="inline">${content}</code>`
    },
    link: {
        regex: /(?:(?:https?):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gi,
        rule: (x) => `<a target="_blank" href="${x}" class="url">${x}</a>`
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
        rule: (x) => `<span class="mention">${x}</span>`
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