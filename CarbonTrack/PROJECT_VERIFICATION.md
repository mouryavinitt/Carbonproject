# CarbonTrack — Academic Project Verification Document

**Project Name:** CarbonTrack — Carbon Footprint Calculator and Tracking Platform  
**Architecture:** Full-Stack Decoupled (React 19 + Vite Frontend / Java 17 + Spring Boot 3 + MySQL Backend)  
**Standard:** Greenhouse Gas Protocol (GHG Protocol Corporate Standard & Scope 1/2/3 Accounting)  
**Verified Emission Factor Sources:** IPCC WGIII, Central Electricity Authority (CEA) Government of India, UK Department for Energy Security and Net Zero (DESNZ), US EPA eGRID, Bureau of Energy Efficiency (BEE) India.

---

## 1. Spring Boot
Spring Boot 3.2.4 provides the core backend runtime environment:
- **Application Entry Point:** `backend/src/main/java/com/carbontrack/CarbonTrackApplication.java` annotated with `@SpringBootApplication`.
- **Auto-configuration & Component Scan:** Automatically scans packages `com.carbontrack.controller`, `com.carbontrack.service`, `com.carbontrack.repository`, `com.carbontrack.entity`, `com.carbontrack.config`, and `com.carbontrack.security`.
- **Dependencies Management:** Defined in `backend/pom.xml` using `spring-boot-starter-parent` 3.2.4, including `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, and `spring-boot-starter-validation`.
- **Data Ingestion Runner:** `backend/src/main/java/com/carbontrack/config/DataInitializer.java` implements `CommandLineRunner` to seed verified scientific factors from `emission-factors.csv` on startup.

---

## 2. Spring MVC & REST APIs
Controllers in package `com.carbontrack.controller` handle all RESTful HTTP communication:
- `AuthController.java`:
  - `POST /api/auth/register` (Register new user, hashes password with BCrypt, issues JWT)
  - `POST /api/auth/login` (Authenticates credentials, returns JWT)
  - `GET /api/auth/me` (Authenticated identity verification)
- `PersonalController.java`:
  - `GET /api/personal/profile` & `PUT /api/personal/profile`
  - `POST /api/personal/calculations` (Validates and computes emissions with verified factors)
  - `GET /api/personal/calculations` (History with year/month filters)
  - `GET /api/personal/calculations/{id}` (Single calculation detail with authorization check)
  - `DELETE /api/personal/calculations/{id}` (Deletes calculation record)
  - `GET /api/personal/dashboard` (Monthly/yearly aggregates, category breakdown, 6-month trends, reduction recommendations)
- `OrganizationController.java`:
  - `GET /api/organizations/profile` & `PUT /api/organizations/profile`
  - `POST /api/organizations/emissions` (Records Scope 1, 2, or 3 operational emission)
  - `GET /api/organizations/emissions` (Lists recorded activities)
  - `GET /api/organizations/dashboard` (Scope breakdown, trends, and recent activities)
  - `GET /api/organizations/reports` (Executive report with percentage distributions)
- `NgoController.java`:
  - `GET /api/ngos/profile` & `PUT /api/ngos/profile`
  - `POST /api/ngos/projects` (Creates climate project)
  - `GET /api/ngos/projects` (Lists authenticated NGO's projects)
  - `PUT /api/ngos/projects/{id}` (Updates project)
  - `DELETE /api/ngos/projects/{id}` (Deletes project)
- `EmissionFactorController.java`:
  - `GET /api/emission-factors` (Lists all verified scientific factors with citations)
  - `GET /api/emission-factors/{id}` (Retrieves single factor documentation)
- `PublicController.java`:
  - `GET /api/public/ngo-projects` (Publicly accessible directory without login)
  - `GET /api/public/health` (Application health status)

Centralized error handling is enforced via `@RestControllerAdvice` in `GlobalExceptionHandler.java`, translating exceptions to standard HTTP response codes (`400`, `401`, `403`, `404`, `500`).

---

## 3. Spring Data JPA
All database operations leverage Spring Data JPA repository interfaces in `com.carbontrack.repository`:
- `UserRepository`: `findByEmail()`, `existsByEmail()`
- `PersonalProfileRepository`: `findByUserId()`, `findByUser()`
- `OrganizationRepository`: `findByUserId()`
- `NgoRepository`: `findByUserId()`
- `EmissionFactorRepository`: `findByActiveTrue()`, `findByActivityTypeAndActiveTrue()`, `findByCategoryAndActiveTrue()`
- `CarbonCalculationRepository`: `findByUserIdOrderByCalculationDateDesc()`, JPQL aggregation queries for monthly/yearly sums
- `EmissionActivityRepository`: `findByCalculationId()`
- `OrganizationEmissionRepository`: `findByOrganizationIdAndReportingPeriod()`, JPQL grouping by Scope and Category
- `CarbonReductionProjectRepository`: `findByNgoIdOrderByCreatedAtDesc()`, `findAllByOrderByCreatedAtDesc()`

---

## 4. Hibernate & JPA Entities
JPA mapping annotations in `com.carbontrack.entity` define the relational mappings:
- `@Entity`, `@Table(name = "...")`
- Primary keys: `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- Column definitions: `@Column(nullable = false, precision = 12, scale = 5)` for precise monetary and scientific quantities
- Relationships:
  - `@OneToOne`: `User` <-> `PersonalProfile`, `User` <-> `Organization`, `User` <-> `Ngo`
  - `@ManyToOne`: `CarbonCalculation` -> `User`, `EmissionActivity` -> `CarbonCalculation`, `OrganizationEmission` -> `Organization`, `CarbonReductionProject` -> `Ngo`
  - `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)`: `CarbonCalculation` -> `EmissionActivity`
- Lifecycle hooks: `@PrePersist` automatically stamping creation timestamps (`LocalDateTime.now()`)

---

## 5. MySQL Configuration & Schema
Configuration defined in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:carbontrack}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

**Database Tables Created in MySQL:**
1. `users` (id, name, email, password, role, created_at)
2. `personal_profiles` (id, user_id, location, occupation, bio)
3. `organizations` (id, user_id, organization_name, industry, location, employee_count, created_at)
4. `ngos` (id, user_id, ngo_name, description, location, website, contact_email, created_at)
5. `emission_factors` (id, category, activity_type, unit, factor, source_organization, source_document, source_url, year, methodology, scope, active)
6. `carbon_calculations` (id, user_id, calculation_date, period, total_emission, electricity_emission, transport_emission, flight_emission, food_emission, waste_emission, other_emission, highest_category, created_at)
7. `emission_activities` (id, calculation_id, category, activity_type, quantity, unit, emission_factor, emission, factor_source)
8. `organization_emissions` (id, organization_id, scope, category, activity_type, quantity, unit, emission_factor, emission, reporting_period, factor_source, logged_at)
9. `carbon_reduction_projects` (id, ngo_id, title, description, goals, estimated_impact, location, contact_information, website, created_at)

---

## 6. Spring Security
Configured in `com.carbontrack.config.SecurityConfig`:
- Stateless session management: `SessionCreationPolicy.STATELESS`.
- CSRF disabled for stateless REST token architecture.
- Password hashing: `BCryptPasswordEncoder` (10 rounds).
- Authorization rules:
  - Public endpoints: `/api/auth/**`, `/api/public/**`, `/api/emission-factors/**`, `/swagger-ui/**`, `/api-docs/**`.
  - Role-protected endpoints:
    - `/api/personal/**` requires `ROLE_PERSONAL`, `ROLE_ORGANIZATION`, or `ROLE_NGO`.
    - `/api/organizations/**` requires `ROLE_ORGANIZATION`.
    - `/api/ngos/**` requires `ROLE_NGO`.
- Authorization failure entry point: `JwtAuthenticationEntryPoint.java` returns structured JSON error responses rather than HTTP Basic prompts.

---

## 7. JWT Authentication
Implemented in `com.carbontrack.security`:
- `JwtTokenProvider.java`: Generates HMAC-SHA256 tokens using `io.jsonwebtoken` with claims for `userId`, `email`, `name`, and `role`. Sets 24-hour expiration (`86,400,000 ms`).
- `JwtAuthenticationFilter.java`: Intercepts incoming requests, extracts `Authorization: Bearer <token>`, validates signature and expiration, extracts user ID, loads `UserDetails`, and populates `SecurityContextHolder`.
- Authorization safeguards: Services verify that authenticated user ID matches the entity's owner ID (`calculation.getUser().getId().equals(userId)`), throwing `UnauthorizedAccessException` on mismatch.

---

## 8. Personal Module
- **Calculation Formula:**
  $$\text{Emissions} = \text{Activity Quantity} \times \text{Verified Emission Factor}$$
- **Categories:** Electricity (kWh), Fuel/Travel (litres or m³), Public Transport (passenger-km), Flights (passenger-km with Radiative Forcing), Food/Diet (days), Waste (kg).
- **Backend Service:** `com.carbontrack.service.CarbonCalculationEngine` calculates category subtotals, total footprint in kg CO2e, determines the highest emitting category, and produces tailored reduction suggestions.

---

## 9. Organization Module & Scopes 1, 2, 3
- **Scope 1 (Direct GHG Emissions):** Company vehicles, diesel generator backup fuel, stationary combustion.
- **Scope 2 (Electricity Indirect GHG Emissions):** Purchased grid electricity measured in kWh against national grid carbon intensity (e.g., CEA India Grid: 0.716 kg CO2e/kWh).
- **Scope 3 (Other Indirect GHG Emissions):** Freight logistics (tonne-km), employee business flights, employee commuting, operational waste.
- **Reports:** Monthly & yearly corporate greenhouse gas audit reports calculating total corporate footprint and scope percentage allocations.

---

## 10. NGO Module
- Allows verified environmental NGOs to create, edit, delete, and view environmental restoration projects.
- Fields: Title, Description, Goals, Location, Estimated Impact (e.g., "1,500 tonnes CO2e sequestered annually"), Contact info, Website.
- Publicly searchable directory at `/projects` without requiring login.

---

## 11. Real Scientific Data & Authoritative Citations
No synthetic or fabricated factors are used. All factors stored in `data/emission-factors.csv` and database:
1. **Grid Electricity (India Average):** 0.71600 kg CO2e/kWh — *Central Electricity Authority (CEA) India, CO2 Baseline Database Ver 19.0 (2023)*
2. **Grid Electricity (UK Average):** 0.20707 kg CO2e/kWh — *UK Department for Energy Security and Net Zero (DESNZ) 2023*
3. **Grid Electricity (US Average):** 0.38600 kg CO2e/kWh — *US EPA eGRID 2023*
4. **Petrol / Gasoline:** 2.31495 kg CO2e/litre — *UK DESNZ 2023*
5. **Diesel:** 2.51233 kg CO2e/litre — *UK DESNZ 2023*
6. **LPG:** 1.55708 kg CO2e/litre — *UK DESNZ 2023*
7. **Natural Gas / CNG:** 2.02135 kg CO2e/m³ — *UK DESNZ & Bureau of Energy Efficiency (BEE) India 2023*
8. **Local City Bus:** 0.09650 kg CO2e/km — *UK DESNZ 2023*
9. **Train / Rail:** 0.03549 kg CO2e/km — *UK DESNZ 2023*
10. **Metro / Subway:** 0.02781 kg CO2e/km — *UK DESNZ 2023*
11. **Domestic Flights (<500 km):** 0.24587 kg CO2e/km — *UK DESNZ 2023 with IPCC Radiative Forcing*
12. **High Meat Diet (>100g/day):** 7.19 kg CO2e/day — *Poore & Nemecek / Science / IPCC (2018)*
13. **Vegetarian Diet:** 3.81 kg CO2e/day — *Poore & Nemecek / Science / IPCC (2018)*
14. **Vegan Diet:** 2.89 kg CO2e/day — *Poore & Nemecek / Science / IPCC (2018)*
15. **Landfill Waste:** 0.44600 kg CO2e/kg — *UK DESNZ 2023*

---

## 12. Frontend Structure & Routing
- Built with React 19, TypeScript, Vite, and Tailwind CSS.
- Client routing with React Router:
  - Public: `/`, `/projects`, `/methodology`, `/auth/login`, `/auth/register`
  - Personal: `/personal/dashboard`, `/personal/calculator`, `/personal/history`, `/personal/profile`
  - Organization: `/organization/dashboard`, `/organization/activities`, `/organization/reports`, `/organization/profile`
  - NGO: `/ngo/dashboard`, `/ngo/projects`, `/ngo/profile`
- Protected by `ProtectedRoute` (checks token) and `RoleGuard` (enforces role boundary).

---

## 13. API Integration
- `src/services/api.ts` uses Axios with baseURL configured to `http://localhost:8080/api` (via `VITE_API_BASE_URL`).
- Automatically attaches `Authorization: Bearer <jwt>` on all requests.
- When backend is running locally, requests flow directly to Spring Boot and persist to MySQL.
- For preview environments where a local MySQL daemon is offline, client-side fallback engines gracefully compute using the exact same formulas and factors.

---

## 14. Verification Test Cases
Backend unit & slice tests located in `backend/src/test/java/com/carbontrack/`:
- `CalculationEngineTest.java`: Verifies exact mathematical accuracy of $Activity \times Factor$, rejects negative quantities, and flags unverified factors.
- `AuthServiceTest.java`: Verifies BCrypt password hashing, registration, and JWT issuance.
- `OrganizationScopeTest.java`: Verifies Scope 1, 2, and 3 calculations.
- `SecurityAuthorizationTest.java`: Verifies prevention of cross-user unauthorized access.
