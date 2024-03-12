import axios from 'axios';
import {
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
} from './api.config';

let token = '';

describe('Gateway Endpoints', () => {
  describe('SignUp Endpoint', () => {
    it('should return a status code 201 on successful signup', async () => {
      const response = await axios.post(signUpUrl, newUserCredentials);
      expect(response.status).toBe(201);
    });

    it('should return a status code 400 on missing signup credentials', async () => {
      await expect(
        axios.post(signUpUrl, missingCredentials)
      ).rejects.toHaveProperty('response.status', 400);
    });

    it('should return a status code 500 on internal server error during signup', async () => {
      await expect(
        axios.post(signUpUrl, invalidSignUpCredentials)
      ).rejects.toHaveProperty('response.status', 500);
    });
  });

  describe('SignIn Endpoint', () => {
    it('should return a status code 200 on successful signin', async () => {
      const response = await axios.post(signInUrl, validSignInCredentials);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('access_token');

      token = `Bearer ${response.data.access_token}`;
    });

    it('should return a status code 400 on missing signin credentials', async () => {
      await expect(
        axios.post(signInUrl, missingCredentials)
      ).rejects.toHaveProperty('response.status', 400);
    });

    it('should return a status code 403 on invalid signin credentials', async () => {
      await expect(
        axios.post(signInUrl, invalidSignInCredentials)
      ).rejects.toHaveProperty('response.status', 403);
    });
  });

  describe('GetAllUsers Endpoint', () => {
    it('should return a status code 200 on all users', async () => {
      const response = await axios.get(usersUrl, {
        headers: { Authorization: token },
      });

      expect(response.status).toBe(200);
    });

    it('should return a status code 401 on Unauthorized Access', async () => {
      try {
        await axios.get(usersUrl, {
          headers: { Authorization: 'Bearer invalid_token' },
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Create Product Endpoint', () => {
    it('should return a status code 201 on product creation', async () => {
      const response = await axios.post(productsUrl, newProduct, {
        headers: { Authorization: token },
      });

      expect(response.status).toBe(201);
    });

    it('should return a status code 401 on Unauthorized Access', async () => {
      try {
        await axios.get(usersUrl, {
          headers: { Authorization: 'Bearer invalid_token' },
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should return a status code 400 on missing signin fields', async () => {
      await expect(
        axios.post(productsUrl, missingProductField, {
          headers: { Authorization: token },
        })
      ).rejects.toHaveProperty('response.status', 400);
    });
  });

  describe('Get User Products Endpoint', () => {
    it('should return a status code 200 on all products', async () => {
      const response = await axios.get(productsUrl, {
        headers: { Authorization: token },
      });

      expect(response.status).toBe(200);
    });

    it('should return a status code 401 on Unauthorized Access', async () => {
      try {
        await axios.get(usersUrl, {
          headers: { Authorization: 'Bearer invalid_token' },
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Filter Products By Name Endpoint', () => {
    it('should return a status code 200 on all products', async () => {
      const response = await axios.get(productsUrl + '/bag', {
        headers: { Authorization: token },
      });

      expect(response.status).toBe(200);
    });

    it('should return a status code 401 on Unauthorized Access', async () => {
      try {
        await axios.get(usersUrl, {
          headers: { Authorization: 'Bearer invalid_token' },
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Get Products By Page Endpoint', () => {
    it('should return a status code 200 on product creation', async () => {
      const response = await axios.post(
        productsUrl + '/products',
        getProducts,
        {
          headers: { Authorization: token },
        }
      );

      expect(response.status).toBe(200);
    });

    it('should return a status code 401 on Unauthorized Access', async () => {
      try {
        await axios.get(usersUrl, {
          headers: { Authorization: 'Bearer invalid_token' },
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should return a status code 400 on missing signin fields', async () => {
      await expect(
        axios.post(productsUrl, missingFieldsProducts, {
          headers: { Authorization: token },
        })
      ).rejects.toHaveProperty('response.status', 400);
    });
  });
});
