let textArea = document.getElementById('textResult'),
    Embed = document.getElementById('embed'),
    Color = document.getElementById('color'),
    isColor = document.getElementById('isColor'),
    isEdit = document.getElementById('isEdit'),
    charCount = document.getElementById('charCount'),
    moreOption = document.getElementById('moreOption'),
    defaultColor = "#202225",
    embed = {
        fields:[],
        edit: ''
    }

let htmlEmbed = {
    title: (string) => {
        return `<div class="embedTitle">${string}</div>`
    },
    description: (string) => {
        return `<div class="embedDescription">${string}</div>`
    },
    field: (field, n) => {
        let gridStyle = 'style="grid-column: '
        if (!field.inline) gridStyle += '1 / 13;"'
        else {
            if (n === 1) gridStyle = '1 / 5;"'
            else if (n === 2) gridStyle = '5 / 9;"'
            else gridStyle = '9 / 13;"'
        }
        return `<div ${gridStyle}><div class="embedFieldName">${getEmoji(field.name.trim())}</div><div class="embedFieldValue">${markdown(field.value.trim())}</div></div>`
    }
}

onEmbedLoad()
function onEmbedLoad () {
    if (Color.value === "#000000") Color.value = defaultColor
    colOrNot (false)
    editMessage (document.getElementById('isEdit'))
    textAnalysis ()
    twemoji.parse(Embed)
}
textArea.oninput = textAnalysis



function copyThat () {
    textArea.value = textArea.value.trim()
    textArea.select()
    document.execCommand("copy")
    textArea.selectionEnd = textArea.selectionStart
    textArea.blur()
}
function colorChange () {
    isColor.checked = true
    if (Color.value === "#ffffff") Color.value = "#feffff"
    colOrNot ()
}
function colOrNot (escape = true) {
    if (isColor.checked) {
        Color.parentElement.style.backgroundColor = Color.value
        Embed.style.borderColor = Color.value
    }
    else {
        Color.parentElement.style.backgroundColor = defaultColor
        Embed.style.borderColor = defaultColor
    }
    if (escape) updateText ()
}
function editMessage () {
    if (!isEdit.checked) {
        moreOption.innerHTML = ''
        updateText()
        updateEmbed()
    }
    else {
        let newNode = document.createElement('div')
        newNode.id = 'editBlock'
        newNode.innerHTML = `<label id="editLabel" for="editInput">Lien du message à éditer : </label><input id="editInput" type="url" oninput="linkAnalyser (this)" value="${embed.edit.replace(/(\d{1,18})\D+(\d{1,18})/g, (v, a, b) => {
            if (!a && !b) return ''
            return (a || '') + '/' + (b || '')            
        })}">`
        moreOption.appendChild(newNode)
        linkAnalyser (document.getElementById('editInput'))
    }
}
function linkAnalyser (input) {
    let ids = input.value.match(/\d{1,18}/g)
/*    embed.edit = input.value.replace(/(\d{1,18}\D)?(\d{1,18})\D+(\d{1,18})/g, (value, useless, a, b) => {
        return `<#${a}> ${b}`
    })*/


    updateText()
    if (!ids || !ids[0]) embedError('Le lien fourni est incorrect.')
    else updateEmbed()
}


function updateText () {
    let text = '!embed '
    if (isEdit.checked) text += `edit ${embed.edit}\n`
    if (isColor.checked) text += Color.value + ' '
    if (embed.title) text += embed.title.trim() + '\n'
    if (embed.description) text += embed.description.trim() + '\n'
    for (let field of embed.fields) text += `\n>> ${embed.inline ? 'inline ' : ''}${field.name}\n${field.value}`


    textArea.value = text
}
function updateEmbed () {
    let html = '', fields = ''
    if (embed.title) html += htmlEmbed.title(getEmoji(embed.title.trim()))
    if (embed.description && embed.description.trim()) html += htmlEmbed.description(markdown(embed.description.trim()))

    if (embed.fields[0]) {
        let n = 0
        for (let field of embed.fields) {
            if (field.inline) n++
            else n = 0
            fields += htmlEmbed.field(field, n%3)
        }
        html += `<div class="embedFields">${fields}</div>`
    }

    Embed.innerHTML = html
    twemoji.parse(Embed)
}
function embedError (err='') {
    Embed.innerHTML = `<div id="embedError"><h1>Erreur !</h1><p>${err}</p></div>`
}