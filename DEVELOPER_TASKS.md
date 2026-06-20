# Developer Test Tasks

Expected total time : **15-20 minutes**.

## Task 1: Show Stock Status On Product Cards

Estimated time: **5-10 minutes**

### Goal

Make product availability clearer in the product listing.

### Requirements

Update product cards to show one stock label:

- `In Stock` when `stock > 10`
- `Low Stock` when `stock > 0 && stock <= 10`
- `Out of Stock` when `stock === 0`

Only update the product card UI. Do not change backend logic.

### Acceptance Criteria

- Product cards show the correct stock label.
- `Out of Stock` is visually distinct from the other labels.
- Existing product card layout still looks good.
- Product listing still loads normally.
- Frontend build passes.

### What This Tests

- Ability to trace product data into UI components
- Conditional rendering
- Small UI polish
- Keeping changes scoped

---

## Task 2: Add Product Count To Category API

Estimated time: **10-15 minutes**

### Goal

Improve the backend category API so clients can display how many active products belong to each category.

### Requirements

Update the backend `GET /category` response so each category includes:

```json
{
  "label": "tops",
  "productCount": 1
}
```

Rules:

- Count only products where `deleted !== true`.
- Categories with no products should return `productCount: 0`.
- Do not change the existing route path.
- Do not break category creation.
- Keep the response wrapped in the existing `ApiResponse` format.

### Acceptance Criteria

- `GET /category` returns all categories.
- Every returned category has a numeric `productCount`.
- Soft-deleted products are not counted.
- `POST /category/add` still works for admins.
- `npm run seed:full` still works.

### What This Tests

- Ability to modify a backend controller safely
- Mongoose querying/aggregation judgment
- Preserving existing API shape
- Understanding seeded product/category data
- Regression awareness

## Verification Commands

Run these before submitting:

```bash
npm run seed:full
```

Optional manual test:

```text
Login as user@shopcart.com / User@123
Open /products
Check product stock labels
Call GET http://localhost:5173/api/category and verify productCount values
```

