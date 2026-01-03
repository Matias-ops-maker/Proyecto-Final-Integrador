import './seed.js';
import { sequelize, Product, Category } from './models/index.js';

(async () => {
  try {
    const categories = await Category.count();
    const products = await Product.count();
    console.log('Categories:', categories);
    console.log('Products:', products);
    process.exit(0);
  } catch (err) {
    console.error('DB CHECK ERROR:', err);
    process.exit(1);
  }
})();
