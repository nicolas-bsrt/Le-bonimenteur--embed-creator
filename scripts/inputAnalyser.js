let embedOption = ["image", "thumbnail", "footer", "edit", "color", "url"]

function textAnalysis () {
    charCount.innerText = `${2000 - textArea.value.length} / 2000`

    try {
        let text = textArea.value.trim()
        if (text.length > 2000) return embedError('Votre message ne peut pas faire plus de 2000 caractères.')

        if (text.length === 0) return textArea.value = '!embed '
        if (!text.toLowerCase().startsWith('!embed')) return embedError('Il faut que votre message commence par "!embed"')


        let options = text.match(/options? ?: ?{.*?(?=})/gis)
        if (options && options[0]) {
            options = options[0].split('{')[1]
                .split(/(?<!\\),/)
                .reduce((result, o) => {
                    let r = o.split(":")
                    if (r[1]) result.push([r[0].trim(), r.slice(1).join(':').trim().replace(/\\,/g, ',')])
                    return result
                }, [])

            for (let n of embedOption) {
                let i = options.find(o => o[0].toLowerCase() === n)
                if (i) embed.options[n] = i[1]
                else delete embed.options[n]
            }
            text = text.replace(/options? ?: ?{.*?}/gis, '')
        }


        let fstLine = text.split('\n')[0],
            title = fstLine.replace(/!embed/i, ''),
            parts = text.slice(fstLine.length + 1).split('>>'),
            desc = true
        if (parts.length > 20) {
            embedError('Vous ne pouvez pas mettre plus de 20 parties à votre message.<br>Il faut en supprimer.')
            return
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
    updateOptions()
}
function embedError (err='') {
    Embed.innerHTML = `<div id="embedError"><h1>Erreur !</h1><p>${err}</p></div>`
    error = true
    copyButton.className = "redButton"
    embedGoodSize ()
}