import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { ENV } from './config/env.js';
import { notFound, errorHandler } from './Middleware/errorMidd.js';

import userRoutes from './Modules/User/User.js';
import categoriesRoutes from './Modules/Category/Category.js';
import productsRoutes from './Modules/Product/Product.js';
import cartRoutes from './Modules/Cart/Cart.js';
import orderRoutes from './Modules/Order/Order.js';
import dashboardRoutes from './Modules/Dashboard/Dashboard.js';

const app = express();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;