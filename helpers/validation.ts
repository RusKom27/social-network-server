
export const checkToken = (token: string | undefined) => {
    if (!token) throw Error("Token not found")
    else return token
}

export const checkUserId = (user_id: string | undefined) => {
    if (!user_id) throw Error("UserId not found")
    else return user_id
}

export const checkFile = (file: Express.Multer.File | undefined) => {
    if (!file) throw Error("File not found")
    else return file
}