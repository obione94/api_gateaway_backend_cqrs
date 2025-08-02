import express from 'express';
import healthzRoutes from './context/healthz/routes/healthzRoute';
import authRoutes from './context/authentication/interfaces/routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/healthz', healthzRoutes);
app.use(authRoutes);


export default app;