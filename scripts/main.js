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
        return `<div ${gridStyle}><div class="embedFieldName">${getEmoji(field.name.trim())}</div><div class="embedFieldValue">${markdown(field.value)}</div></div>`
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
function textAnalysis () {
    charCount.innerText = `${2000 - textArea.value.length} / 2000`
    if (!textArea.value.match(/ *?!embed/gi)) return embedError('Il faut que votre message commence par "!embed"')

    try {
        let text = textArea.value.trim(),
            fstLine = text.split('\n')[0]


        if (isEdit.checked) {
            let a
         /*   input.value = input.value.replace(/\/(\d{18})\/(\d{18})\/(\d{18})/gi, (cor, a) => {
                return `${a}/${embed.edit.channel}/${embed.edit.message}`
            })*/
           // text += text.split('\n').slice(1).join('\n')
        }/*
        else
   /*     if (fstLine.split(/ +/g)[1] === 'edit') {
            isEdit.checked = true
            let linkInput = document.getElementById('editInput'),
                linkData = linkInput.value.match(/\d{18}/g),
                idsDataC = fstLine.match(/<#\d{18}>/g),
                idsDataM = fstLine.match(/(?<!<#)\d{18}/g)

            if (!idsData || idsData.length() !== 2) return embedError('Il faut ')
            if (!linkData) linkInput.value = `${idsDataC}/${idsDataM}`


        }
        else {
            isEdit.checked = false

        }*/


        let //fstLine = text.split('\n')[0],
            parts = text.slice(fstLine.length +1).split('>>'), desc = true,
            color = fstLine.match(/#[0-9a-f]{6}(?= )/gi),
            title = fstLine.replace(/(!embed)|(#[0-9a-f]{6})/gi, '')
        if (parts.length > 20) {
            embedError('Vous ne pouvez pas mettre plus de 20 parties à votre message.<br>Il faut en supprimer.')
            return
        }



        if (color && color[0]) {
            Color.value = color[0]
            isColor.checked = true
            colOrNot(false)
        }
        else {
            isColor.checked = false
            colOrNot(false)
        }

        if (title) {
            if (title.trim().length > 256) return embedError('Le titre ne dois pas faire plus de 256 caractères.')
            embed.title = title
        }
        else delete embed.title

        if (parts[0] !== "") embed.description = parts[0]
        else delete embed.description

        embed.fields = []
        for (let p of parts) {
            if (p === "" || desc) {
                desc = false
                continue
            }

            let par = p.split("\n"),
                trFal = false,
                tt = par[0].trim(),
                ct = par.slice(1).join("\n").trim(),
                parameter = tt.split(/ +/gi)


            if (parameter[0] === "inline" || parameter[1] === "inline") {
                trFal = true
                tt = tt.replace(/inline/gi, "").trim()
            }
            if (parameter[0] === "blank" || parameter[1] === "blank") {
                embed.fields.push({
                    name: "\u200b",
                    value: "\u200b",
                    inline: trFal
                })
                continue
            }

            if (tt.trim().length > 256) return embedError('Les titres des parties ne peuvent pas faire plus de 256 caractères.')
            if (ct.trim().length > 1024) return embedError('Le contenu des parties ne peut pas faire plus de 256 caractères.')

            embed.fields.push({
                name: (!tt || tt === "")?"\u200b":tt,
                value: (!ct || ct === "")?"\u200b":ct,
                inline: trFal
            })
        }
    }
    catch (err) {
        embedError(err)
        return
    }
    updateEmbed ()


   /*








    let t = newArgs.split("\n")[0],
        part = newArgs.slice(t.length +1),
        embed = new Discord.MessageEmbed (),
        tour = 0,
        ima = part.match(/https:\/\/cdn\.discordapp\.com\/attachments.+?(?=\s)/g)
    if (ima && ima[0]) {
        part = part.replace(ima[0], '')
        embed.setImage(ima[0])
    }
    part = part.split(">>")



    if (t !== "") {
        let link = t.match(/http.+?(?=\s)/g)
        if (link && link[0]) {
            link = link[0]
            t = t.replace(link, "")
            let url = await isDiscord(link, client)
            if (url) {
                embed.setThumbnail(url.guild.iconURL({format: 'png'}))
                t = url.guild.name
            }
            embed.setURL(link)
        }
        embed.setTitle(t.substring(0,250))
    }

    if (part[0] !== "") embed.setDescription(part[0])
    for (let p of part) {
        tour++
        if (p === "" || tour === 1) continue
        let par = p.split("\n"),
            trFal = false,
            tt = par[0].trim(),
            ct = par.slice(1).join("\n").trim(),
            parameter = tt.split(/ +/gi)

        if (parameter[0] === "inline" || parameter[1] === "inline") {
            trFal = true
            tt = tt.replace(/inline/gi, "").trim()
        }
        if (parameter[0] === "blank" || parameter[1] === "blank") {
            embed.addField("\u200b", "\u200b", trFal)
            continue
        }

        tt = (!tt || tt === "")?"** **":tt
        ct = (!ct || ct === "")?"** **":ct
        embed.addField(tt.substring(0,250), ct.substring(0,1000), trFal)
    }

    message.delete()
    if (!msg) await message.channel.send(embed)
    else {
        try {
            await msg.edit(embed)
        }
        catch (e) {
            await message.channel.send("Je ne peux pas éditer ce message. Il a peut-être été supprimé ou je n'en suis peut-être pas l'auteur.")
            return
        }
        await message.channel.send('<:permission_1:483262452457537558> Fait')
    }


*/

}
function updateEmbed () {
    let html = '', fields = ''
    if (embed.title) html += htmlEmbed.title(getEmoji(embed.title.trim()))
    if (embed.description && embed.description.trim()) html += htmlEmbed.description(markdown(embed.description))

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