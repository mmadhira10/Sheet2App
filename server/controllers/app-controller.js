const App = require('../models/app-schema')
const View = require('../models/view-schema')
const Table = require('../models/table-schema')

const createApp = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const finishedBody = {
        ...body,
        published: false
    }

    const newApp = new App(finishedBody);
    if (!newApp) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    try {
        const savedApp = await newApp.save();
        return res.status(200).json({
            success: true,
            app: savedApp
        })
    } catch (error) {
        return res.status(400).json({
            errorMessage: error
        })
    }
}

module.exports = {
    createApp
}

