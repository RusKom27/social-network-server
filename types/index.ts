
export type PostFilter = {
    author_id?: string,
    text?: string | RegExp,
    likes?: string | { "$all": string[]}
}

export type PostSort = {

}