
export const getTagsFromText = (text: string) => {
    const tags: string[][] = text
        .split(' ')
        .filter(word => word.includes('#'))
        .map(word => {
            let tags = word.split('#')
            tags.shift()
            return tags.map(tag => deletePunctuationMarks(tag))
        })
    let result = []
    for (const row of tags) for (const tag of row) result.push(tag);
    return result
}

export const deletePunctuationMarks = (text: string) => {
    const PATTERN = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;
    return text.replace(PATTERN, '')
}

export const convertBufferToBase64 = (buffer: ArrayBufferLike) => {
    return btoa(new Uint8Array(buffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
}

export const bufferToImageSource = (image_buffer: string, image_type: string) => {
    return `data:${image_type};base64,${image_buffer}`
}