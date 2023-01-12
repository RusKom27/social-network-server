import {Document, Types} from "mongoose"

export default interface IPost extends Document {
    _id: Types.ObjectId;
    author_id: Types.ObjectId;
    text: string;
    image: string;
    tags: string[]
    likes: Types.ObjectId[];
    views: Types.ObjectId[];
    creation_date: Date;
}

// {
//     "_id": {
//     "$oid": "63af0c14fbf22fa4df4f63fa"
// },
//     "author_id": {
//     "$oid": "638cb4f92fcb67b4aa2bfdf4"
// },
//     "text": "fwefwe wefwe wewef",
//     "image": "",
//     "likes": [
//     {
//         "$oid": "638cb3e62fcb67b4aa2bfdd0"
//     },
//     {
//         "$oid": "638cb4f92fcb67b4aa2bfdf4"
//     },
//     {
//         "$oid": "639ec7225edf70d6e3d1057b"
//     },
//     {
//         "$oid": "63a15a6e5b1d3686284d2365"
//     }
// ],
//     "views": [
//     {
//         "$oid": "63a15a6e5b1d3686284d2365"
//     },
//     {
//         "$oid": "638cb3e62fcb67b4aa2bfdd0"
//     },
//     {
//         "$oid": "639ec7225edf70d6e3d1057b"
//     }
// ],
//     "creation_date": {
//     "$date": {
//         "$numberLong": "1672416276008"
//     }
// },
//     "__v": 7,
//     "tags": []
// }