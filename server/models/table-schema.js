const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ColumnNested = {
    name: { type: String, required: true },
    initial_val: { type: String, required: true },
    label: { type: Boolean, required: true },
    reference: { type: Schema.Types.ObjectId, ref: "Table"},
    type: { type: String, required: true },
}

const TableSchema = new Schema(
    {
        name: { type: String, required: true },
        URL: { type: String, required: true },
        sheet_index: {type: Number,required:true},
        key: { type: Number, required: true},
        columns: { type: [ColumnNested], required: true},
        published: {type:Boolean, required:true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Table', TableSchema)
