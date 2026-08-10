import app from './app.js';
import connectDB from './Config/db.js';
import { ENV } from './Config/env.js';

connectDB();

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});