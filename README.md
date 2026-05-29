# SweetMart — Online Indian Sweets Ordering Platform

A full-stack e-commerce web application for ordering traditional Indian sweets (mithai). Built as a Final Year Major Project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.4.5, Spring Security, Spring Data JPA |
| Database | MySQL |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Payment | Razorpay Integration |
| API Docs | Swagger / OpenAPI (SpringDoc) |
| Build Tool | Maven |

---

## Features

### Customer
- Browse and search sweets by name or category
- Add to cart with inline quantity controls
- Checkout with shipping address and payment method selection
- View order history with status tracking
- User registration and authentication (HTTP Basic)

### Admin
- Dedicated admin panel (accessible after admin login)
- Add, edit, and delete products
- Add, edit, and delete categories
- Role-based access control (ROLE_ADMIN / ROLE_CUSTOMER)

---

## Project Structure

```
├── Backend/
│   └── sweetmart/
│       ├── src/main/java/com/cu/sweetmart/
│       │   ├── config/          # Security, CORS, UserDetailsService, DataInitializer
│       │   ├── controller/      # REST API controllers
│       │   ├── model/           # JPA entities
│       │   ├── repository/      # Spring Data repositories
│       │   ├── service/         # Business logic layer
│       │   └── exception/       # Custom exceptions & global handler
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
│
├── Frontend/
│   ├── index.html               # Landing page / Shop
│   ├── assets/
│   │   ├── css/style.css        # Unified stylesheet
│   │   └── js/
│   │       ├── index.js         # Shop page logic
│   │       ├── login.js         # Authentication
│   │       ├── cart.js          # Shopping cart
│   │       ├── checkout.js      # Order placement
│   │       ├── orders.js        # Order history
│   │       └── admin.js         # Admin panel CRUD
│   └── pages/
│       ├── login.html
│       ├── cart.html
│       ├── checkout.html
│       ├── orders.html
│       └── admin.html
│
└── erd.dbml                     # Database schema in DBML format
```

---

## Database Schema

The database consists of 9 tables using single-table inheritance for the user hierarchy:

- **users** — Base table (discriminator: Customer / Admin)
- **cart** — Shopping cart per customer
- **cart_product** — Many-to-many join table (Cart ↔ Product)
- **category** — Product categories (Ladoo, Barfi, Halwa, etc.)
- **product** — Sweet items with price, description, availability
- **sweet_order** — Customer orders with status tracking
- **order_item** — Line items within an order
- **order_bill** — Invoice/billing records
- **payments** — Razorpay payment transaction records

Full schema available in `erd.dbml` — paste into [dbdiagram.io](https://dbdiagram.io) to visualize.

---

## ER Diagram

<img width="1366" height="976" alt="Untitled (1)" src="https://github.com/user-attachments/assets/1ad07666-b7c9-47b5-aadd-a20c2be558c6" />


## Getting Started

### Prerequisites
- Java 17+
- Maven
- MySQL Server
- Any static file server (for frontend)

### Backend Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE sweetmart_db;
   ```

2. Update `Backend/sweetmart/src/main/resources/application.properties` if your MySQL credentials differ:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. Run the Spring Boot application:
   ```bash
   cd Backend/sweetmart
   mvn spring-boot:run
   ```

4. The backend starts on `http://localhost:8080`
5. A default admin user is created on first run: **admin / admin123**
6. Swagger UI available at: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. Serve the Frontend folder with any static server:
   ```bash
   cd Frontend
   python -m http.server 5500
   ```

2. Open `http://localhost:5500` in your browser.

---

## API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/customer/add` | Customer registration |
| GET | `/product/all` | List all products |
| GET | `/product/{id}` | Get product by ID |
| GET | `/product/search?name=` | Search products |
| GET | `/product/category/{id}` | Products by category |
| GET | `/category/all` | List all categories |

### Authenticated (Any Logged-in User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sweet_order/add` | Place a new order |
| GET | `/sweet_order/customer/{id}` | Get orders by customer |
| GET | `/customer/{id}` | Get customer details |
| GET | `/cart/{id}` | Get cart |

### Admin Only (ROLE_ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/product/add` | Add new product |
| PUT | `/product/update` | Update product |
| DELETE | `/product/delete/{id}` | Delete product |
| POST | `/category/add` | Add new category |
| PUT | `/category/update` | Update category |
| DELETE | `/category/delete/{id}` | Delete category |

---

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Customer | *(register via signup)* | *(user-defined)* |

---

## Security

- Authentication: HTTP Basic Auth backed by database (via `CustomUserDetailsService`)
- Passwords: BCrypt encoded
- CORS: Configured for cross-origin requests
- Role-based access: `ROLE_ADMIN` for product/category management, `ROLE_CUSTOMER` for ordering

---

## Screenshots

<!-- Add your screenshots here -->
Home Page:
<img width="833" height="446" alt="Homepage" src="https://github.com/user-attachments/assets/5d2cea9d-0599-4128-85cf-855df1707f5f" />

Admin Panel:

<img width="818" height="445" alt="admin_panel" src="https://github.com/user-attachments/assets/f8aa9d54-0e20-4078-8ce0-3a4394d7c316" />




---

## Authors

<!-- Add your name and details here -->
Rupesh Tiwari
---

## License

This project is developed for academic purposes as a Final Year Major Project.
