// import Dashboard from '../models/Dashboard'

import asyncHandler from 'express-async-handler'


const getDashboard = asyncHandler(async(req, res) => {
    console.log('in getDashboard')
    // const dashboard = await Dashboard.find().select('-password').lean();

    if (!dashboard) {
        // return res.status(400).json({message: 'no dashboard items found' })
    }

    // res.json(dashboard);
    res.json({message: "made it to dashboard!"})
})


export { getDashboard }