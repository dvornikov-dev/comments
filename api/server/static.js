import express from 'express';

export default (port) => {
  const app = express();
  app.get('/', (req, res) => {
    res.end('Welcome');
  });
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};
