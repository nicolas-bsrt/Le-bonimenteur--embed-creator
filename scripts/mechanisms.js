function mechanismsOnload () {
    let  toReduces = document.getElementsByClassName('toReduce')
    for (let tR of toReduces) if (!tR.style.maxHeight) tR.style.maxHeight = tR.scrollHeight + 'px'
}
mechanismsOnload()

function DisplayElement (element, extend) {
    let toReduce = element.parentElement.getElementsByClassName('toReduce')[0],
        arrow = element.getElementsByClassName('categoryArrow')[0],
        opener = (reduced, newSize) => reduced.style.maxHeight = newSize + 'px'

    if (!toReduce.offsetHeight || extend) {
        opener (toReduce, toReduce.scrollHeight)
        arrow.classList.remove('categoryArrowClosed')
    }
    else {
        opener (toReduce, 0)
        arrow.classList.add('categoryArrowClosed')
    }

    let parent = element.parentElement.parentElement
    while (parent && parent.classList.contains('toReduce')) {
        opener (parent, parent.scrollHeight + toReduce.scrollHeight)
        parent = parent.parentElement.parentElement
    }
}