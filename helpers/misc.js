
const getTagsFromText = (text) => {
    return [].concat(
        ...text
            .split(' ')
            .filter(word => word.includes('#'))
            .map(word => {
                let tags = word.split('#')
                tags.shift()
                return tags.map(tag => deletePunctuationMarks(tag))
            }))
}

const deletePunctuationMarks = (text) => {
    const PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;
    return text.replace(PATTERN, '')
}

module.exports = {
    getTagsFromText,
    deletePunctuationMarks
}