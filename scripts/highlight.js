function linkedHighlight (element) {
    let className = element.id.split('-')[0],
        embed = document.getElementById(`${className}-embed`),
        aide = document.getElementById(`${className}-aide`)

    if (className !== 'highlightColor') {
        if (embed.classList.contains('linkedEmbedBlock')) {
            embed.style.border = '2px solid red'
            embed.style.margin = '-6px -8px'
        }
        else embed.style.boxShadow = '0 0 0 3px red'
    }
    aide.style.backgroundColor = '#2f3136'
}
function removeEffect (element) {
    let className = element.id.split('-')[0],
        embed = document.getElementById(`${className}-embed`),
        aide = document.getElementById(`${className}-aide`)

    embed.style.border = 'unset'
    if (embed.classList.contains('linkedEmbedBlock')) embed.style.margin = '-4px -6px'
    else embed.style.boxShadow = 'unset'
    aide.style.backgroundColor = 'unset'
}

function colorHighlight (element) {
    let embed = document.getElementById('embed')
    if (embed.style.borderColor === 'red') {
        embed.style.borderColor = 'rgb(98, 205, 210)'
        element.style.backgroundColor = 'unset'

    }
    else {
        embed.style.borderColor = 'red'
        element.style.backgroundColor = '#2f3136'
    }
}