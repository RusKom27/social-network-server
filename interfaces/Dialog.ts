import {Document, Types} from "mongoose";

interface IDialog extends Document {
    _id: Types.ObjectId
    members_id: Types.ObjectId[]
    createdAt: Date;
    updatedAt: Date;
}

export default IDialog;

// {
//     "_id": {
//     "$oid": "63adc17962d4d9aafd8737d1"
// },
//     "members_id": [
//     {
//         "$oid": "638cb4f92fcb67b4aa2bfdf4"
//     },
//     {
//         "$oid": "639ec7225edf70d6e3d1057b"
//     }
// ],
//     "creation_date": {
//     "$date": {
//         "$numberLong": "1672331641755"
//     }
// },
//     "__v": 0
// }