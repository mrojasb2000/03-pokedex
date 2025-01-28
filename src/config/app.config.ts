export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodbUrl: process.env.MONGODB_URL,
  serverPort: Number(process.env.PORT) || 8000,
  paginationLimit: Number(process.env.PAGINATION_DEFAULT_LIMIT) || 10,
  paginationOffset: Number(process.env.PAGINATION_DEFAULT_OFFSET) || 0,
});
