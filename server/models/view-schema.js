const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        name: { type: String, required: true },
        table: { type: Schema.Types.ObjectId, ref: "Table"},
        columns: { type: [String], required: true},
        view_type: {type: String,required:true},
        filter: { type: String},
        user_filter: { type: String},
        edit_filter: { type: String},
        editable_columns: { type: [String]},
    },
    { timestamps: true },
)

module.exports = mongoose.model('View', ViewSchema)