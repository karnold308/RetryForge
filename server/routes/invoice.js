
import express from 'express';
import router from express.router();
import { getAllInvoices } from '../controllers/invoicesController';

router.route('/')
    .get(getAllInvoices)
    .post()
    .patch()
    .delete

export { router };