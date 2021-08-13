let textArea = document.getElementById('textResult'),
    Embed = document.getElementById('embed'),
    Color = document.getElementById('color'),
    isColor = document.getElementById('isColor'),
    isEdit = document.getElementById('isEdit'),
    editBlock = document.getElementById('editBlock'),
    editInput = document.getElementById('editInput'),
    charCount = document.getElementById('charCount'),
    copyButton = document.getElementById('copyButton'),
    defaultColor = "#202225",
    error = false,
    embed = {
        fields:[],
        options: {}
    },
    lastOptions = {}

let htmlEmbed = {
    title: (string) => {
        return `<div class="embedTitle">${string}</div>`
    },
    description: (string) => {
        return `<div class="embedDescription">${string}</div>`
    },
    field: (fields) => {
        let gridStyle = 'style="grid-column: ',
            scheme = (field, gridStyle) => `<div ${gridStyle}><div class="embedFieldName">${getEmoji(field.name.trim())}</div><div class="embedFieldValue">${markdown(field.value.trim())}</div></div>`


        if (fields.length === 1) {
            return scheme(fields[0], (gridStyle + '1 / 13;"'))
        }
        else if (fields.length === 2) {
            return scheme(fields[0], (gridStyle + '1 / 7;"'))
                + scheme(fields[1], (gridStyle + '7 / 13;"'))
        }
        else {
            return scheme(fields[0], (gridStyle + '1 / 5;"'))
                + scheme(fields[1], (gridStyle + '5 / 9;"'))
                + scheme(fields[2], (gridStyle + '9 / 13;"'))
        }
    },
    image: (link) => {
        return `<img src="${link}" alt="image invalide" class="embedImage" onload="embedGoodSize()"/>`
    },
    thumbnail: (link) => {
        return `<img src="${link}" alt="image invalide" class="embedThumbnail" onload="embedGoodSize()"/>`
    },
    footer: (string) => {
        return `<div class="embedFooter">${string}</div>`
    }
}

onEmbedLoad()
function onEmbedLoad () {
    if (Color.value === "#000000") Color.value = defaultColor
    textAnalysis ()
    twemoji.parse(Embed)
}
textArea.oninput = textAnalysis



function copyThat () {
    textArea.value = textArea.value.trim()
    if (!error) {
        textArea.select()
        document.execCommand("copy")
        textArea.selectionEnd = textArea.selectionStart
        textArea.blur()
    }
}



function colorChange () {
    isColor.checked = true
    if (Color.value === "#ffffff") Color.value = "#feffff"
    colOrNot ()
    updateText ()
}
function colOrNot () {
    if (isColor.checked) {
        Color.parentElement.style.backgroundColor = Color.value
        Embed.style.borderColor = Color.value
        embed.options.color = Color.value
    }
    else {
        delete embed.options.color
        Color.parentElement.style.backgroundColor = defaultColor
        Embed.style.borderColor = defaultColor
    }
}
function editMessage () {
    if (isEdit.checked) {
        editBlock.style.display = ''
        editInput.value = lastOptions.edit || ''
        linkEdition ()
    }
    else {
        editBlock.style.display = "none"
        delete embed.options.edit
        updateText()
        updateEmbed()
    }
}
function linkEdition () {
    if (editInput.value.match(/https:\/\/discordapp.com\/channels\/\d{18}/g))
        embed.options.edit = editInput.value.replace(
            /https:\/\/discordapp.com\/channels\/\d{18}\/(\d{1,18})\D+(\d{1,18})/g,
            (value, a, b) => `<#${a}> ${b}`
        )
    else if (editInput.value.match(/\d{1,18}\D+\d{1,18}/g))
        embed.options.edit = editInput.value.replace(
            /(?:<#)?(\d{1,18})\D+(\d{1,18})/g,
            (content, a, b) => `<#${a}> ${b}`
        )
    else embed.options.edit = editInput.value


    lastOptions.edit = embed.options.edit
    updateText()
    console.log('should be done')
    linkAnalyser ()
}
function linkAnalyser () {
    if (!embed.options.edit) return embedError("Vous ne m'avez pas donné d'informations (lien, mention...) pour trouver un message à éditer.")
    let link = embed.options.edit.split(/[\/ ]+/)
    if (link.length < 2) return embedError("Vous ne m'avez pas donné assez d'informations pour trouver un message à éditer. Il me faut le salon et le message.")
    if (link.length > 2) return embedError("Vous m'avez donné trop d'informations pour trouver un message à éditer. Je n'ai besoin que du message à éditer et du salon dans lequel il se trouve.")


    if (!link[1].match(/(?<!\d)\d{18}(?!\d)/g))
        return embedError("L'identifiant du message est incorect.")
    if (!link[0].match(/(?:(?<!\d)\d{18}(?!\d))|(?:(?<!<)#.+)/g))
        return embedError("L'identifiant ou la mention du salon est incorect.")

    updateEmbed()
}


function updateText () {
    let exist = false,
        options = []
    for (let o in embed.options) {
        if (o === 'icon') continue
        options.push(`${o}: ${embed.options[o].replace(',', '\\,')}`)
    }


    if (options.length === 0) {
        textArea.value = textArea.value.replace(/ ?options? ?: ?{.*?}/gis, '')
    }
    else {
        textArea.value = textArea.value.replace(/(options? ?: ?{).*?}/gis, (content, start) => {
            exist = true
            return `${start}${options.join(', ')}}`
        })
        if (!exist) textArea.value += ` options: {${options.join(', ')}}`
    }
}
function updateEmbed () {
    error = false
    copyButton.className = "greenButton"
    let html = '', fields = ''
    if (embed.title && embed.title.trim()) {
        let embedTitle = getEmoji(embed.title.trim())
        if (embed.options.url) embedTitle = `<a class="url" href="${embed.options.url}">${embedTitle}</a>`
        html += htmlEmbed.title(embedTitle)
    }
    if (embed.description && embed.description.trim()) html += htmlEmbed.description(markdown(embed.description.trim()))

    if (embed.fields[0]) {
        let inlineFields = []
        for (let field of embed.fields) {
            if (field.inline)  {
                inlineFields.push(field)
                if (inlineFields.length === 3 || field === embed.fields[embed.fields.length -1]) {
                    fields += htmlEmbed.field(inlineFields)
                    inlineFields = []
                }
            }
            else {
                if (inlineFields.length !== 0) {
                    fields += htmlEmbed.field(inlineFields)
                    inlineFields = []
                }
                fields += htmlEmbed.field([field])
            }
        }
        html += `<div class="embedFields">${fields}</div>`
    }

    if (embed.options.image) html += htmlEmbed.image(embed.options.image)
    if (embed.options.thumbnail) html += htmlEmbed.thumbnail(embed.options.thumbnail)
    else if (embed.options.icon) html += htmlEmbed.thumbnail(embed.options.icon)
    if (embed.options.footer && embed.options.footer.trim()) html += htmlEmbed.footer(embed.options.footer)
    Embed.innerHTML = html
    twemoji.parse(Embed)
    embedGoodSize ()
}
function embedGoodSize () {
    if (Embed.parentElement.offsetHeight) Embed.parentElement.style.maxHeight = Embed.parentElement.scrollHeight + 'px'
}
function updateOptions () {
    if (embed.options.color) {
        if (embed.options.color !== lastOptions.color) {
            lastOptions.color = embed.options.color
            isColor.checked = true
            Color.value = embed.options.color
            colOrNot()
        }
    }
    else {
        delete lastOptions.color
        isColor.checked = false
        colOrNot()
    }


    if (embed.options.url) {
        if (embed.options.url !== lastOptions.url) {
            lastOptions.url = embed.options.url
            if (!embed.options.thumbnail && embed.options.url.match(/discord\.gg/g)) getInvitation(embed.options.url)
            else delete embed.options.icon
        }
    }
    else {
        delete lastOptions.url
    }


    if (embed.options.edit) {
        if (lastOptions.edit !== embed.options.edit) {
            isEdit.checked = true
            editBlock.style.display = ''
            linkAnalyser ()
            editInput.value = embed.options.edit
        }
    }
    else {
        isEdit.checked = false
        editBlock.style.display = "none"
    }
}
function getInvitation (url) {
    let code = url.match(/(?<=discord\.gg\/).+/g)
    if (!code || !code[0]) return


    let xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                let invitation = xmlHttp.response
                if (invitation) {
                    embed.options.icon = `https://cdn.discordapp.com/icons/${invitation.guild.id}/${invitation.guild.icon}.png`
                    updateEmbed()
                }
            }
            else if (xmlHttp.status === 404) {
                delete embed.options.icon
                updateEmbed()
            }
        }
    }


    xmlHttp.open("GET", ('https://discordapp.com/api/v6/invites/' + code[0]), true)
    xmlHttp.responseType = 'json'
    xmlHttp.send(null)
}