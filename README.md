# TransitOps — Smart Transport Operations Platform

TransitOps is a modern fleet management and transport operations platform. It streamlines vehicle dispatching, driver compliance, preventative maintenance, route calculations, and operational expense tracking for commercial fleets.

---

## 1. Features

- **Fleet Registry & Asset Tracking:** Comprehensive lifecycle management for commercial vehicles with unique registration indexing, payload capacity validation, odometer tracking, and real-time operational status (`Available`, `On Trip`, `In Shop`, `Retired`).
- **Dispatch & Trip Lifecycle:** State-driven trip management (`Draft`, `Dispatched`, `Completed`, `Cancelled`) with automated vehicle and driver availability guards, payload weight verification, and double-dispatch prevention.
- **Driver Management & Compliance:** Driver records with licence category tracking, expiration guards, safety rating history, and active duty assignments.
- **Route Intelligence (OSRM Integration):** Real-time distance and estimated travel time calculations powered by OpenStreetMap routing services.
- **Maintenance & Work Orders:** Automated vehicle state synchronization (`In Shop` during active maintenance) to prevent conflicting trip dispatches.
- **Operational Cost & Fuel Accounting:** Fuel efficiency metrics, cost-per-kilometer tracking, and vehicle ROI reporting with CSV data export.
- **Role-Based Access Control:** Role segregation for Fleet Managers, Dispatchers, and Safety Officers via signed JWT authentication.

---

## 2. Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Vite, Axios, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Routing API:** OpenStreetMap / OSRM
- **Authentication:** JWT, bcryptjs

---

## 3. Project Structure

```text
transitops/
├── backend/
│   ├── public/
│   │   └── index.html             # Static assets
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database connection
│   │   ├── controllers/
│   │   │   └── healthController.js # Health probe controller
│   │   ├── middleware/
│   │   │   ├── requestContext.js  # Request context middleware
│   │   │   ├── requestLogger.js   # HTTP logger
│   │   │   ├── notFoundHandler.js # 404 handler
│   │   │   └── errorHandler.js    # Global error handler
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── utils/
│   │   │   └── logger.js          # Console logger
│   │   ├── validators/            # Request validators
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # React context
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # Layout shells
│   │   ├── pages/                 # Route pages
│   │   ├── services/              # API services
│   │   ├── App.jsx                # Router configuration
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

---

## 4. Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/transitops?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
Create `frontend/.env` based on `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB Atlas cluster

### Installation
From the root directory:

```bash
npm run install:all
```

### Running the App
Start both backend and frontend concurrently:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

### Running Services Separately
- Backend only:
  ```bash
  npm run dev:backend
  ```
- Frontend only:
  ```bash
  npm run dev:frontend
  ```

---

## 6. Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs backend and frontend concurrently |
| `npm run dev:backend` | Starts Express backend with hot-reload |
| `npm run dev:frontend` | Starts Vite frontend dev server |
| `npm run build:frontend` | Builds production frontend assets |
| `npm run lint:frontend` | Runs ESLint on frontend code |
