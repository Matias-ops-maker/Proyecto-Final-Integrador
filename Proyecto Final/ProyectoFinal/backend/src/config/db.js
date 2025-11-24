import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_DIALECT === 'sqlite' ? './database.sqlite' : undefined,
  host: process.env.DB_DIALECT === 'mysql' ? process.env.DB_HOST : undefined,
  username: process.env.DB_DIALECT === 'mysql' ? process.env.DB_USER : undefined,
  password: process.env.DB_DIALECT === 'mysql' ? process.env.DB_PASS : undefined,
  database: process.env.DB_DIALECT === 'mysql' ? process.env.DB_NAME : undefined,
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: true
  },
  dialectOptions: process.env.DB_DIALECT === 'sqlite' ? {

    pragma: {
      foreign_keys: 0
    }
  } : {}
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar la DB:', error);
    return false;
  }
};

export { testConnection };
export default sequelize;
