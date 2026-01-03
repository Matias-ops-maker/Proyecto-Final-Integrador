/**
 * Simple Dependency Injection Container
 * Centralizes service instantiation and management
 */

import { ProductService } from "./productService.js";
import { CartService } from "./cartService.js";
import { PaymentService } from "./paymentService.js";
import { OrderService } from "./orderService.js";
import { BrandService } from "./brandService.js";
import { CategoryService } from "./categoryService.js";
import { UserService } from "./userService.js";
import { VehicleService } from "./vehicleService.js";
import { ReportService } from "./reportService.js";
import { AuthService } from "./authService.js";

class ServiceContainer {
  constructor() {
    this.services = {};
    this.registerServices();
  }

  registerServices() {
    // Domain Services
    this.register('productService', ProductService);
    this.register('cartService', CartService);
    this.register('paymentService', PaymentService);
    this.register('orderService', OrderService);
    this.register('brandService', BrandService);
    this.register('categoryService', CategoryService);
    this.register('userService', UserService);
    this.register('vehicleService', VehicleService);
    this.register('reportService', ReportService);
    this.register('authService', AuthService);
  }

  register(name, service) {
    this.services[name] = service;
  }

  get(name) {
    const service = this.services[name];
    if (!service) {
      throw new Error(`Service "${name}" not found in container`);
    }
    return service;
  }

  getAll() {
    return this.services;
  }
}

// Singleton instance
const container = new ServiceContainer();

export default container;
