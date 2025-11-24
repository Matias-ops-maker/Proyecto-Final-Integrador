import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano_desde: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ano_hasta: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  motor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'vehicles',
  timestamps: false,
});

export default Vehicle;

