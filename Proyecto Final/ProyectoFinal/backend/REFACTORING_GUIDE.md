# Backend Refactoring Guide - SOLID & Clean Code Implementation

## Executive Summary

This guide documents the progressive refactoring of the backend service layer to apply **SOLID principles** and **Clean Code** practices. The refactoring introduces:

- ✅ Service-based architecture (7 services)
- ✅ Validator layer separation (3 validators)
- ✅ Helper utilities for cross-cutting concerns
- ✅ Comprehensive test coverage (68 tests)
- ✅ Adapter pattern for external APIs
- ✅ Error code routing for clean error handling

**Status**: Complete for Products, Cart, Payments, Orders, Brands, Categories
**Pending**: Users (auth), Vehicles, Reports

---

## Architecture Overview

### Before Refactoring
```
Controller
  ├─ Direct DB queries
  ├─ Validation logic
  ├─ Business logic
  ├─ Error handling
  └─ Response formatting
```

### After Refactoring
```
Controller
  ├─ Validates input (Validator)
  ├─ Delegates to Service
  ├─ Catches error codes
  └─ Formats response (ApiResponse)

Service
  ├─ Business logic
  ├─ DB queries
  ├─ Error throwing
  └─ Data transformation

Validator
  └─ Input validation rules

Helper
  ├─ ApiResponse (formatting)
  ├─ ErrorHandler (code mapping)
  └─ ValidationHelper (utilities)
```

---

## Implementation Pattern

### 1. Create Service
**File**: `src/services/[domain]Service.js`

```javascript
import { Model1, Model2 } from '../models/index.js';

export default class {
  static async create(data) {
    // Validate business rules
    if (condition) {
      const error = new Error('User-friendly message');
      error.code = 'ERROR_CODE';
      throw error;
    }
    
    // Create and return
    return await Model1.create(data);
  }

  static async getById(id) {
    const record = await Model1.findByPk(id);
    if (!record) return null;
    return record;
  }

  static async list(filters = {}) {
    return await Model1.findAndCountAll({
      where: filters,
      // ... include relationships
    });
  }

  static async update(id, data) {
    const record = await Model1.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record;
  }

  static async delete(id) {
    // Check dependencies before deletion
    if (hasDependencies) {
      const error = new Error('Cannot delete');
      error.code = 'HAS_DEPENDENCIES';
      throw error;
    }
    return await Model1.destroy({ where: { id } });
  }
}
```

### 2. Create Validator
**File**: `src/services/validators/[domain]Validator.js`

```javascript
export function validateCreate(data) {
  const errors = [];

  if (!data.field1) errors.push('field1 required');
  if (data.field2 && typeof data.field2 !== 'string') {
    errors.push('field2 must be string');
  }
  if (data.precio && data.precio <= 0) {
    errors.push('precio must be > 0');
  }

  if (errors.length > 0) {
    throw { code: 'VALIDATION_ERROR', details: errors };
  }

  return data;
}

export function validateUpdate(data) {
  // Similar to validateCreate but for updates
  // Some fields may be optional
}
```

### 3. Refactor Controller
**File**: `src/controllers/[domain]Controller.js`

```javascript
import Service from '../services/[domain]Service.js';
import { validateCreate, validateUpdate } from '../services/validators/[domain]Validator.js';
import { ApiResponse, ErrorHandler } from '../helpers/apiHelpers.js';

export async function create(req, res) {
  try {
    // Validate input
    validateCreate(req.body);

    // Call service
    const result = await Service.create(req.body);

    // Return success response
    res.status(201).json(ApiResponse.success(result, 'Created successfully'));
  } catch (error) {
    // Handle service errors
    if (error.code === 'DUPLICATE_SKU') {
      return res.status(400).json(ApiResponse.error('SKU already exists', 'DUPLICATE_SKU'));
    }
    
    // Handle validation errors
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json(ApiResponse.error('Validation failed', 'VALIDATION_ERROR', 400, error.details));
    }

    // Generic error
    console.error('Error in create:', error);
    res.status(500).json(ApiResponse.error('Internal server error'));
  }
}

export async function list(req, res) {
  try {
    const { page = 1, pageSize = 12, ...filters } = req.query;
    const { rows, count } = await Service.list(filters);

    res.json(ApiResponse.paginated(rows, count, page, pageSize));
  } catch (error) {
    console.error('Error in list:', error);
    res.status(500).json(ApiResponse.error('Internal server error'));
  }
}
```

### 4. Register Route
**File**: `src/routes/[domain].js`

```javascript
import express from 'express';
import { create, list, getById, update, delete } from '../controllers/[domain]Controller.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', list);
router.get('/:id', getById);

// Admin routes
router.post('/', verifyToken, verifyAdmin, create);
router.put('/:id', verifyToken, verifyAdmin, update);
router.delete('/:id', verifyToken, verifyAdmin, delete);

export default router;
```

---

## Service Implementation Examples

### ProductService
**Key Features:**
- SKU uniqueness validation
- Stock management
- Vehicle compatibility filtering
- Category/Brand relationships

```javascript
static async create(data) {
  // Check SKU uniqueness
  const existing = await Product.findOne({ where: { sku: data.sku } });
  if (existing) {
    const error = new Error(`SKU ${data.sku} already exists`);
    error.code = 'SKU_EXISTS';
    throw error;
  }

  return await Product.create(data);
}
```

### CartService
**Key Features:**
- Auto-create cart if missing
- Stock validation before adding items
- Automatic total calculation
- Cart clearing on order placement

```javascript
static async addItem(userId, productId, cantidad) {
  // Get or create cart
  let cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) {
    cart = await Cart.create({ user_id: userId });
  }

  // Validate stock
  const product = await Product.findByPk(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  if (product.stock < cantidad) {
    const error = new Error(`Insufficient stock for ${product.nombre}`);
    error.code = 'INSUFFICIENT_STOCK';
    error.details = `${product.stock} available`;
    throw error;
  }

  // Add to cart
  return await CartItem.create({
    cart_id: cart.id,
    product_id: productId,
    cantidad
  });
}
```

### PaymentService with MercadoPagoAdapter
**Key Features:**
- External API abstraction
- Preference creation with expiry
- Webhook handling
- Sandbox/production modes

```javascript
class MercadoPagoAdapter {
  constructor(token, publicKey) {
    this.client = new mercadopago.MercadoPagoConfig({
      accessToken: token,
    });
  }

  async createPreference(items, payer) {
    const preference = new mercadopago.Preference(this.client);

    return preference.create({
      body: {
        items,
        payer,
        expires_in: 86400, // 24 hours
        auto_return: 'approved'
      }
    });
  }
}
```

### OrderService with Transactions
**Key Features:**
- Atomic order creation with transactions
- Stock deduction on order placement
- Payment record creation
- Cart clearing on success
- Rollback on failure

```javascript
static async create(userId, shippingAddress, paymentMethod) {
  const t = await sequelize.transaction();

  try {
    // Validate cart
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: { model: CartItem, include: Product }
    });

    if (!cart || !cart.CartItems.length) {
      const error = new Error('Cart is empty');
      error.code = 'EMPTY_CART';
      throw error;
    }

    // Create order with transaction
    const order = await Order.create({
      user_id: userId,
      total: calculatedTotal,
      estado: 'pendiente'
    }, { transaction: t });

    // Add items and deduct stock
    for (const item of cart.CartItems) {
      await OrderItem.create({ /* ... */ }, { transaction: t });
      item.Product.stock -= item.cantidad;
      await item.Product.save({ transaction: t });
    }

    // Create payment record
    await Payment.create({ /* ... */ }, { transaction: t });

    // Clear cart
    await CartItem.destroy({ /* ... */ }, { transaction: t });

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
```

---

## Testing Patterns

### Unit Test Example (Service)
```javascript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('ProductService', () => {
  let ProductService, Product, Category;

  beforeEach(async () => {
    await jest.unstable_mockModule('../src/models/index.js', () => ({
      Product: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
      },
      // ... other models
    }));

    const models = await import('../src/models/index.js');
    Product = models.Product;

    const service = await import('../src/services/productService.js');
    ProductService = service.default;
  });

  it('should throw SKU_EXISTS error on duplicate', async () => {
    Product.findOne.mockResolvedValue({ id: 1 });

    try {
      await ProductService.create({ sku: 'DUP-001', /* ... */ });
      throw new Error('Should have thrown');
    } catch (error) {
      expect(error.code).toBe('SKU_EXISTS');
    }
  });
});
```

### Integration Test Example (Endpoint)
```javascript
import request from 'supertest';

describe('Products Integration Tests', () => {
  const API_KEY = 'mi_api_key_super_secreta';

  it('should retrieve list of products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('x-api-key', API_KEY)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });
});
```

---

## Error Handling Pattern

### Service Layer
```javascript
// Throw with error codes
const error = new Error('User-friendly message');
error.code = 'ERROR_CODE';
error.details = 'Additional details if needed';
throw error;
```

### Controller Layer
```javascript
try {
  const result = await Service.method(data);
} catch (error) {
  if (error.code === 'SPECIFIC_ERROR') {
    return res.status(400).json(ApiResponse.error(message, error.code));
  }
  res.status(500).json(ApiResponse.error('Internal server error'));
}
```

### Response Helper
```javascript
class ApiResponse {
  static success(data, message = 'Success') {
    return { success: true, data, message };
  }

  static error(message, code = 'ERROR', status = 500, details = null) {
    return {
      success: false,
      error: message,
      code,
      ...(details && { details })
    };
  }

  static paginated(data, total, page, pageSize) {
    return {
      data,
      pagination: {
        page: +page,
        pageSize: +pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
```

---

## SOLID Principles Applied

### Single Responsibility (SRP)
- Each service handles one domain (Product, Cart, Payment)
- Validators handle only input validation
- Controllers orchestrate calls
- Helpers provide utilities

### Open/Closed (OCP)
- Easy to extend with new error codes
- Adapter pattern allows payment API swaps
- Service methods can be extended without breaking

### Liskov Substitution (LSP)
- All services follow same interface
- MercadoPagoAdapter can be swapped
- Error handling consistent across services

### Interface Segregation (ISP)
- Validators export specific functions
- Services expose minimal API
- Helpers focused on specific tasks

### Dependency Inversion (DIP)
- Controllers depend on service abstractions
- External APIs abstracted (MercadoPago)
- Models injected via imports

---

## Remaining Refactoring Tasks

### 1. UserService (High Priority)
- Extract authentication logic
- Password hashing abstraction
- Token generation/validation
- Email validation

### 2. VehicleService
- Vehicle CRUD
- Specification management
- Brand/Year compatibility

### 3. ReportService
- Analytics queries
- Order statistics
- Revenue calculations
- Trend analysis

### 4. AuditLogService
- Activity logging
- User action tracking
- Change history

---

## Running & Debugging

### Run Tests
```bash
# All tests
npm test

# Specific suite
npm test productService.test.js

# Integration only
npm test integration/

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Debug Tests
```bash
# Run single test
npm test -- -t "should create"

# Verbose output
npm test -- --verbose

# Print debug statements
node --inspect node_modules/jest/bin/jest.js
```

### Running Backend
```bash
# Development
npm run dev

# Production
npm start

# Test with seed data
npm run seed
```

---

## Checklist for Refactoring New Domains

- [ ] Create `src/services/[domain]Service.js`
- [ ] Create `src/services/validators/[domain]Validator.js`
- [ ] Create `tests/[domain]Service.test.js`
- [ ] Create `tests/integration/[domain].integration.test.js`
- [ ] Refactor `src/controllers/[domain]Controller.js`
- [ ] Update `src/routes/[domain].js` if needed
- [ ] Run `npm test` - verify all tests pass
- [ ] Run `npm run lint` - fix any linting issues
- [ ] Create git commit with descriptive message
- [ ] Document in this guide

---

## Performance Considerations

### Caching Strategy (Future Enhancement)
```javascript
// Service with caching
static cache = new Map();

static async getById(id) {
  if (this.cache.has(id)) {
    return this.cache.get(id);
  }

  const record = await Model.findByPk(id);
  this.cache.set(id, record);
  return record;
}

static invalidateCache(id) {
  this.cache.delete(id);
}
```

### Database Query Optimization
- Always include relationships
- Use pagination for lists
- Index frequently queried fields
- Use transactions for multi-step operations

---

## Security Considerations

### Input Validation
- Always validate in service layer
- Use validators before processing
- Sanitize user input

### Authorization
- Check user role in controllers
- Use `verifyToken`, `verifyAdmin` middleware
- Validate ownership before updates/deletes

### Error Messages
- Don't expose internal details
- Use generic error messages for production
- Log full errors server-side only

---

## Monitoring & Logging

### Structured Logging
```javascript
console.error('❌ Error in [method]:', error);
console.log('📥 [METHOD] [ROUTE]');
console.log('✅ [Operation] completed');
```

### Performance Monitoring
- Track slow database queries
- Monitor transaction duration
- Alert on repeated errors

---

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://en.wikipedia.org/wiki/Code_smell)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Sequelize Documentation](https://sequelize.org/)
- [Jest Testing](https://jestjs.io/)

