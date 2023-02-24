

export type Sort = {
    user?: [string, OrderBy][]
    post?: [string, OrderBy][]
    topic?: [string, OrderBy][]
    message?: [string, OrderBy][]
}

export type OrderBy = "ascending" | "descending" | "asc" | "desc" | 1 | -1