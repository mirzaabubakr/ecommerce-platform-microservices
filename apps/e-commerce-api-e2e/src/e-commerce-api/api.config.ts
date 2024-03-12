import * as dotenv from 'dotenv';
dotenv.config();
const { SERVER_PORT } = process.env;
const port = SERVER_PORT || 3000;
const baseUrl = `http://localhost:${port}`;
const signUpUrl = `${baseUrl}/auth/signup`;
const signInUrl = `${baseUrl}/auth/signin`;
const usersUrl = `${baseUrl}/users`;
const productsUrl = `${baseUrl}/product`;

const newUserCredentials = {
  email: 'demouser@gmail.com',
  role: 1,
  password: 'password',
};

const missingCredentials = {
  password: 'password',
};

const invalidSignUpCredentials = {
  email: 'demouser@gmail.com',
  password: 'password123',
};

const validSignInCredentials = {
  email: 'demouser@gmail.com',
  password: 'password',
};

const invalidSignInCredentials = {
  email: 'demouser@gmail.com',
  password: 'password123',
};

const newProduct = {
  productName: 'Guitar',
  productPrice: 43000,
};

const missingProductField = {
  productPrice: 43000,
};

const missingFieldsProducts = {
  pageSize: 10,
  sortOrder: 'DESC',
};

const getProducts = {
  page: 1,
  pageSize: 10,
  sortOrder: 'DESC',
};

export {
  baseUrl,
  signUpUrl,
  signInUrl,
  usersUrl,
  productsUrl,
  newUserCredentials,
  newProduct,
  missingProductField,
  missingCredentials,
  invalidSignUpCredentials,
  validSignInCredentials,
  missingFieldsProducts,
  getProducts,
  invalidSignInCredentials,
};
