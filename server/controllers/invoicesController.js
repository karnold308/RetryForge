import Invoice from '../models/Invoice'

import asyncHandler from 'express-async-handler'


const getAllInvoices = asyncHandler(async(req, res) => {
    const invoices = await Invoice.find().select('-password').lean();

    if (!users) {
        return res.status(400).json({message: 'no invoices found' })
    }

    res.json(invoices);
})


export { getAllInvoices }