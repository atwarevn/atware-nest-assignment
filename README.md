# Backend Assignment: Food Pre-Order API (NestJS)

## Overview

This assignment evaluates your backend skills regarding API architecture, data handling, and mastery of the **NestJS** framework. You are provided with a "base" repository that is functional but intentionally written like a poorly structured Express application crammed into a NestJS wrapper.

Your goal is to refactor this codebase to utilize the full power of NestJS—transforming it into a clean, strictly-typed, and production-ready backend that adheres to modern architectural principles.

---

## Requirements

### Must-Have

* **Strict Request Validation:** Ensure all incoming request payloads are strictly validated for correct data types and required fields before any business logic is executed.
* **Business Logic Constraints:** The `POST /api/orders` endpoint must enforce the following rules:
    * **Constraint 1:** The total number of dishes (sum of all servings) must be $\geq$ the number of people selected.
    * **Constraint 2:** A maximum of 10 servings per specific dish is allowed.
    * **Constraint 3:** Duplicate `dishId`s within the same order payload are not permitted.
    * **Constraint 4 (Data Integrity):** The API must verify that the requested restaurant exists, that it offers the specified meal type, and that all submitted dishes genuinely belong to that specific restaurant.
* **Secure Price Calculation:** The API must calculate and return the `totalPrice` of the order. Price calculation must be handled securely on the backend based on the local data; never trust a price provided by the client.
* **Global Error Handling:** The application must have a centralized mechanism to catch unhandled exceptions, ensuring that clients always receive a consistent, structured JSON error response.

---

### Great-to-Have (Optional)

* **Performance Traps:** Spot and fix severe bottlenecks if any.
* **Idiomatic NestJS:** Replace the manual, Express-style HTTP handling with native NestJS features, serialization, and decorators.
* **Testing**: Write unit or integration tests for the core validation logic (e.g., total servings vs. headcount).

---

## The Challenge: From "Bad" to "Great"

The current repository is functional but contains several architectural and performance flaws you are expected to identify and address:

1. **Architectural Design:** The current implementation lacks proper separation of concerns, heavily mixing routing, business logic, and data access. You are expected to refactor the codebase into a scalable, properly layered architecture.
2. **Data Handling Strategy:** The current approach to reading and serving data creates significant I/O overhead on every request. You should design a highly performant strategy for accessing and serving the provided static datasets.

---

## Setup & Development

**Install dependencies**
```bash
npm install
```

**Run development server**
```bash
npm run start:dev
```
The server will start on http://localhost:3000.
