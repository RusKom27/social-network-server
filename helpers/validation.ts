
export const getToken = (token: string | undefined) => {
    if (!token) throw Error("Token not found");
    else return token;
};

export const getUserId = (user_id: string | undefined) => {
    if (!user_id) throw Error("UserId not found");
    else return user_id;
};

export const getFile = (file: Express.Multer.File | undefined) => {
    if (!file) throw Error("File not found");
    else return file;
};