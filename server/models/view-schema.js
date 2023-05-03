const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        name: { type: String, required: true },
        table: { type: Schema.Types.ObjectId, ref: "Table"},
        columns: { type: [String], required: true},
        view_type: {type: String,required:true, enum: ["Table", "Detail"]},
        allowed_actions: { type: [String], required: true},
        roles: { type: [String], required: true},
        filter: { type: String, default: ""},
        user_filter: { type: String, default: ""},
        edit_filter: { type: String, default: ""},
        editable_columns: { type: [String], default: []},
    },
    { timestamps: true },
)

module.exports = mongoose.model('View', ViewSchema)