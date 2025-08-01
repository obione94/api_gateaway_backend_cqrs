import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/healthz', (req: Request, res: Response) => {
  res.status(202).json({
            status: 'accepted',message: 'born to be a live ccc'
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});