import {Document, Types} from "mongoose";

interface IImage extends Document {
    _id: Types.ObjectId
    name: string
    // image: Types.Buffer
    contentType: string
    createdAt: Date;
    updatedAt: Date;
}

export default IImage;
// {
//     "_id": {
//     "$oid": "639b47f0a672f7cffc82c313"
// },
//     "name": "user1_avatar.png",
//     "image": {
//     "$binary": {
//         "base64": "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAA
//             "subType": "00"
//     }
// },
//     "contentType": "image/png",
//     "createdAt": {
//     "$date": {
//         "$numberLong": "1671120880826"
//     }
// },
//     "updatedAt": {
//     "$date": {
//         "$numberLong": "1671120880826"
//     }
// },
//     "__v": 0
// }