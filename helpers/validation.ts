
export const checkToken = (token: string | undefined) => {
    if (!token) throw Error("Token not found")
    else return token
}

export const checkFile = (file: Express.Multer.File | undefined) => {
    if (!file) throw Error("File not found")
    else return file
}