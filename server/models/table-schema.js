const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ColumnNested = {
    name: { type: String, required: true },
    initial_val: {},
    label: { type: Boolean, required: true },
    reference: { type: Schema.Types.ObjectId, ref: "Table"},
    type: { type: String, required: true, enum: ["Boolean", "Number", "Text", "URL"]},
}

const TableSchema = new Schema(
    {
        name: { type: String, required: true },
        URL: { type: String, required: true },
        sheet_id: {type: Number,required:true},
        key: { type: String, required: true},
        columns: { type: [ColumnNested], required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Table', TableSchema)

