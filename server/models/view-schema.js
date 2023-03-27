const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        name: { type: String, required: true },
        table: { type: Schema.Types.ObjectId, ref: "Table"},
        columns: { type: [String], required: true},
        view_type: {type: String,required:true},
        filter: { type: String, required: true},
        user_filter: { type: String, required: true},
        edit_filter: { type: String, required: true},
        editable_columns: { type: [String], required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('View', ViewSchema)