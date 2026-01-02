const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

process.env.DB_NAME = 'repuestos_test';
process.env.NODE_ENV = 'test';

jest.setTimeout(30000);
