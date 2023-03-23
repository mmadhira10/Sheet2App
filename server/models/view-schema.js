const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        name: { type: String, required: true },
        table: { type: Schema.Types.ObjectId, ref: "Table"},
        view_type: {type: String,required:true},
        filter: { type: Number, required: true},
        user_filter: { type: Number, required: true},
        edit_filter: { type: Number, required: true},
        editable_columns: { type: [Number], required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('View', ViewSchema)