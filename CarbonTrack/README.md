# 🌱 CarbonTrack — Carbon Footprint Calculator & Tracking Platform

A production-grade, college-level full-stack web application designed for personal, organizational, and NGO carbon emissions tracking, calculation, and reporting using verified scientific emission factors from official government and international bodies (IPCC, CEA India, UK DESNZ, US EPA).

---

## 📋 Table of Contents
1. [Overview & Features](#overview--features)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [MySQL Database Setup](#mysql-database-setup)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
9. [Scientific Emission Factors & Methodology](#scientific-emission-factors--methodology)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## 1. Overview & Features

### 👤 Personal Module
- **Interactive Carbon Calculator:** Compute emissions across Electricity, Petrol/Diesel, Public Transit, Flights, Food/Lifestyle, and Waste.
- **Defensible Formula:** $\text{Emissions (kg CO2e)} = \text{Activity Data} \times \text{Emission Factor}$.
- **Comprehensive Dashboard:** Real-time metrics for total footprint, monthly totals, year-to-date footprint, and highest contributor.
- **Category Breakdown & Trends:** Visual distribution and 6-month historical trajectory.
- **Evidence-Based Reduction Recommendations:** Dynamically generated advice targeting the user's highest emitting category.
- **Historical Ledger:** Filter past calculations by month/year, inspect itemized activity factor citations, or delete past records.

### 🏢 Organization Module (GHG Protocol Scopes 1, 2, 3)
- **Scope 1 (Direct Emissions):** Company vehicles, diesel generators, stationary fuel combustion.
- **Scope 2 (Purchased Energy):** Grid electricity draw measured against regional grid factors (e.g. CEA India 0.716 kg CO2e/kWh).
- **Scope 3 (Value Chain):** Freight transport, business air travel, employee commuting, and operational waste.
- **Corporate Reports & PDF Export:** Clean executive greenhouse gas statements with exact scope percentages.

### 🌱 NGO Module
- **Project Publication:** Publish community reforestation, clean mobility, or clean energy projects.
- **Impact Tracking:** Quantify estimated carbon sequestration impact.
- **Public Directory:** Visitors can search and browse initiatives without logging in.

### 🔬 Methodology & Scientific Registry
- Dedicated `/methodology` page explaining CO2e, GWP, calculation equations, and a complete searchable registry of all emission factors with direct links to official publications.

---

## 2. Technology Stack

### Backend
- **Language:** Java 17
- **Framework:** Spring Boot 3.2.4
- **Web:** Spring MVC (RESTful Controllers)
- **Persistence:** Spring Data JPA & Hibernate
- **Database:** MySQL 8.x
- **Security:** Spring Security & BCrypt Password Hashing
- **Tokens:** JSON Web Token (`jjwt` 0.11.5)
- **API Docs:** Springdoc OpenAPI 3 (Swagger UI)
- **Build Tool:** Maven

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** Tailwind CSS (light, clean, modern environmental palette)

---

## 3. Architecture

```
React Frontend (Port 3000 / 5173)
        ↓  (Axios with Bearer JWT)
REST API Controllers
        ↓
Service Layer (Calculation Engine & Business Logic)
        ↓
Repository Layer (Spring Data JPA)
        ↓
Hibernate ORM
        ↓
MySQL Database (Port 3306)
```

---

## 4. Prerequisites

Before running the application, make sure you have installed:
- **Java 17 JDK** (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)
- **Node.js 18+ and npm** (`node -v` and `npm -v`)
- **MySQL 8.0+** running locally on your machine

---

## 5. MySQL Database Setup

1. Open your terminal or MySQL Workbench:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE carbontrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Verify creation:
```sql
SHOW DATABASES;
```

Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update` and `createDatabaseIfNotExist=true`, meaning all required tables (`users`, `emission_factors`, `carbon_calculations`, etc.) will be created automatically on initial startup.

---

## 6. Environment Variables

An example configuration file is provided at `.env.example`:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=carbontrack
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

# Security
JWT_SECRET=carbontrack_super_secure_jwt_secret_key_2026_min_256_bits_for_sha256

# Server Port
SERVER_PORT=8080

# Frontend API Target
VITE_API_BASE_URL=http://localhost:8080/api
```

You can export these variables in your shell or update `backend/src/main/resources/application.properties` directly.

---

## 7. Running the Application

### Step 1: Run the Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

The backend server starts on **http://localhost:8080**.  
Upon startup, `DataInitializer.java` reads `emission-factors.csv` and automatically populates the `emission_factors` table with verified authoritative factors.

### Step 2: Run the React Frontend

Open a new terminal window:

```bash
cd frontend    # or root directory
npm install
npm run dev
```

The frontend will run on **http://localhost:3000** (or **http://localhost:5173**).

---

## 8. API Documentation (Swagger/OpenAPI)

Once the backend is running, access the interactive Swagger UI at:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

You can authorize requests in Swagger by clicking the **Authorize** button and pasting your JWT token.

---

## 9. Scientific Emission Factors & Methodology

CarbonTrack adheres to a **Strict Scientific Verification Policy**: no numbers are fabricated or estimated randomly.

| Category | Activity | Factor | Unit | Authoritative Source |
| :--- | :--- | :--- | :--- | :--- |
| **Electricity** | Grid Electricity (India) | 0.71600 | kg CO2e/kWh | Central Electricity Authority (CEA) India, Ver 19 (2023) |
| **Electricity** | Grid Electricity (UK) | 0.20707 | kg CO2e/kWh | UK DESNZ (2023) |
| **Electricity** | Grid Electricity (US) | 0.38600 | kg CO2e/kWh | US EPA eGRID (2023) |
| **Fuel** | Petrol / Gasoline | 2.31495 | kg CO2e/litre | UK DESNZ (2023) |
| **Fuel** | Diesel | 2.51233 | kg CO2e/litre | UK DESNZ (2023) |
| **Fuel** | LPG | 1.55708 | kg CO2e/litre | UK DESNZ (2023) |
| **Fuel** | Natural Gas / CNG | 2.02135 | kg CO2e/m³ | UK DESNZ & Bureau of Energy Efficiency (BEE) India |
| **Transport** | Local City Bus | 0.09650 | kg CO2e/passenger-km | UK DESNZ (2023) |
| **Transport** | Train / Rail | 0.03549 | kg CO2e/passenger-km | UK DESNZ (2023) |
| **Transport** | Metro / Subway | 0.02781 | kg CO2e/passenger-km | UK DESNZ (2023) |
| **Flights** | Domestic (<500 km) | 0.24587 | kg CO2e/passenger-km | UK DESNZ & IPCC (with Radiative Forcing) |
| **Diet** | High Meat (>100g/day) | 7.19000 | kg CO2e/day | Poore & Nemecek / Science / IPCC (2018) |
| **Diet** | Vegetarian | 3.81000 | kg CO2e/day | Poore & Nemecek / Science / IPCC (2018) |
| **Diet** | Vegan | 2.89000 | kg CO2e/day | Poore & Nemecek / Science / IPCC (2018) |
| **Waste** | Landfill Solid Waste | 0.44600 | kg CO2e/kg | UK DESNZ (2023) |

---

## 10. Testing

### Run Backend Tests:
```bash
cd backend
mvn test
```

Includes tests for:
- `CalculationEngineTest`: Mathematical accuracy, unit matching, validation of negative inputs.
- `AuthServiceTest`: BCrypt hashing, duplicate email handling, JWT generation.
- `OrganizationScopeTest`: Scope 1 direct emissions calculation.
- `SecurityAuthorizationTest`: Cross-user record access prevention.

---

## 11. Troubleshooting

- **MySQL Connection Refused:** Verify that your local MySQL service is running (`sudo systemctl status mysql` or `services.msc` on Windows).
- **Access Denied for user 'root':** Check your password in `application.properties` or set `DB_PASSWORD=your_password`.
- **CORS Error:** Ensure `carbontrack.cors.allowed-origins` in `application.properties` includes your frontend port (defaults to port 3000 and 5173).
- **Port Conflict (8080 or 3000 occupied):** Override port via `SERVER_PORT=8081` in environment or command line: `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081`.
