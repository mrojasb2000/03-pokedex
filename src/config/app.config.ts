export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodbUrl: process.env.MONGODB_URL,
  serverPort: process.env.PORT || 8000,
  paginationLimit: process.env.PAGINATION_DEFAULT_LIMIT || 10,
  paginationOffset: process.env.PAGINATION_DEFAULT_OFFSET || 10,
});
