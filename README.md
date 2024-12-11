---

# Project Setup and Development Guide

Follow the steps below to set up and run the project:

---

## **Installation**

1. Install dependencies:
   ```bash
   npm i
   ```

---

## **Running the Application**

1. Start the database and Svelte server:
   ```bash
   npm run db:start
   ```

2. Apply database migrations:
   ```bash
   npm run db:push
   ```

---

## **Useful Links**

- **Create Page**: [http://localhost:5173/create](http://localhost:5173/create)
- **List Page**: [http://localhost:5173/list](http://localhost:5173/list)

---

## **Optional**

### Database Studio
1. To open the database admin panel:
   ```bash
   npm run db:studio
   ```
2. Visit [https://local.drizzle.studio/](https://local.drizzle.studio/) to view and manage the database.

---