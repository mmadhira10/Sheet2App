const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AppSchema = new Schema(
    {
        name: { type: String, required: true },
        creator: { type: String, required: true },
        tables: [{ type: Schema.Types.ObjectId, ref: 'Table' }],
        views: [{ type: Schema.Types.ObjectId, ref: 'View' }],
        role_membership_sheet: {type:String, required:true},
        published: {type:Boolean, required:true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('App', AppSchema)


