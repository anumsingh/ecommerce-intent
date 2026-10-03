# OmniPrice — Real-Time ML Purchase Intent Prediction & Multi-Store Price Intelligence Platform

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)](https://expressjs.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat&logo=python)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat&logo=flask)](https://flask.palletsprojects.com/)
[![LightGBM](https://img.shields.io/badge/LightGBM-ML-ff69b4?style=flat)](https://lightgbm.readthedocs.io/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)

> **OmniPrice** is an end-to-end e-commerce platform that combines **real-time multi-store price scraping** (Amazon, Myntra, Ajio) with a **sequential machine learning purchase intent prediction engine** (LightGBM). It tracks live user session interactions across 4 behavioral dimensions to dynamically forecast buying likelihood.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Key Features](#-key-features)
3. [Machine Learning Engine & Behavioral Telemetry](#-machine-learning-engine--behavioral-telemetry)
4. [Tech Stack](#-tech-stack)
5. [Prerequisites](#-prerequisites)
6. [How to Run the Entire Project (Quick Start)](#-how-to-run-the-entire-project-quick-start)
7. [Running Individual Services (Manual Setup)](#-running-individual-services-manual-setup)
8. [Database Configuration (MongoDB Atlas)](#-database-configuration-mongodb-atlas)
9. [Project Directory Structure](#-project-directory-structure)
10. [API Endpoints Reference](#-api-endpoints-reference)

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph Client ["React + Vite Frontend (Port 3000)"]
        UI[Cyber Dark UI / Landing Page]
        Gauge[ML Intent Gauge & 4 Aspect Meters]
        Grid[Platform Columns & Product Cards]
        Modal[Price History Radar & Auth Modal]
    end

    subgraph NodeServer ["Node.js + Express API Gateway (Port 5000)"]
        AuthRoutes[Auth & JWT Routes]
        ProductRoutes[Product Search Proxy]
        IntentRoutes[Intent Event Broker]
        WishlistRoutes[Cloud Wishlist & Alerts]
    end

    subgraph PythonML ["Python Flask Microservice (Port 5001)"]
        Scrapers[Amazon / Myntra / Ajio Scrapers]
        LGBM[LightGBM Model Inference]
        Tracker[Session Intent Tracker]
    end

    subgraph Database ["Cloud Database"]
        Atlas[(MongoDB Atlas Cloud DB)]
    end

    UI -->|Search / View / Click| NodeServer
    NodeServer -->|Telemetry & Search| PythonML
    NodeServer -->|Users & Wishlist| Atlas
    PythonML -->|Scraped Data + ML Score| NodeServer
    NodeServer -->|Real-time Predictions| UI
```

---

## ✨ Key Features

- **🛍️ Multi-Store Real-Time Scraping**: Queries Amazon, Myntra, and Ajio concurrently, pulling live titles, prices, ratings, discount badges, and store links in milliseconds.
- **🧠 Real-Time ML Purchase Intent Prediction**: Computes continuous buying probability from 0% to 100% using a LightGBM GBDT model trained on sequential session deltas.
- **🧭 4-Dimensional Behavioral Breakdown**:
  1. *Exploration Depth (20%)*: Dwell time & product reach.
  2. *Price Comparison (30%)*: Cross-store benchmarks & price history views.
  3. *Action Commitment (35%)*: Wishlist additions, price drop alerts & buy clicks.
  4. *Decision Focus (15%)*: Browsing cadence & interaction consistency.
- **📈 Historical Price Radar**: Interactive SVG trend chart visualizing 90-day price fluctuations with automated "Great Deal" / "Wait for Price Drop" advice.
- **🔒 MongoDB Atlas Authentication**: Secure registration and sign-in with bcrypt password encryption, password strength indicators, password visibility toggles, and one-click demo login.
- **❤️ Cloud Wishlist & Price Drop Alerts**: Persistent item tracking and email alert arming backed by MongoDB Atlas.
- **📊 Price Matrix Excel Export**: Generates `.xlsx` spreadsheets comparing lowest prices across all stores for any search term.
- **🌐 Home Landing Page & Demo Quota**: Guest visitors get 2 free demo searches to experience the ML engine before registration.

---

## 🧠 Machine Learning Engine & Behavioral Telemetry

The purchase intent prediction engine combines sequential session interactions with machine learning:

1. **Model**: LightGBM Classifier (`lightgbm_model.pkl`) trained on session interaction sequences and time deltas.
2. **Feature Extraction**: Extracts 14 sequential temporal deltas, item frequency, unique platforms touched, dwell time, and bottom-of-funnel actions.
3. **Multi-Aspect Heuristic Blending**: Blends the tree model probability (40%) with multi-aspect behavioral heuristics (60%) for stable, progressive scoring that starts at **0% on new search queries** and increments only with meaningful interaction.

---

## 💻 Tech Stack

| Tier | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Vanilla CSS (Glassmorphism 2.0), Lucide React Icons |
| **Backend** | Node.js 18+, Express.js, JSON Web Tokens (JWT), Mongoose ODM, Axios |
| **ML & Scraping** | Python 3.10+, Flask, LightGBM, NumPy, BeautifulSoup4, Requests |
| **Database** | MongoDB Atlas (Cloud Cluster) |

---

## ⚙️ Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10, v3.11, or v3.12 ([Download Python](https://www.python.org/))
- **Git**: For cloning and version control ([Download Git](https://git-scm.com/))

---

## 🚀 How to Run the Entire Project (Quick Start)

The repository includes an all-in-one orchestrator script [`start.js`](file:///d:/EcomProject%20Copy/ecommerce-purchase-intent-prediction/ecommerce-mern-platform/start.js) that launches the Python ML microservice, the Express backend, and the Vite frontend simultaneously.

### Step 1: Open Terminal in Platform Directory
```bash
cd "d:\EcomProject Copy\ecommerce-purchase-intent-prediction\ecommerce-mern-platform"
```

### Step 2: Install Dependencies (First-Time Only)

```bash
# 1. Install root & platform dependencies
npm install

# 2. Install server dependencies
cd server
npm install
cd ..

# 3. Install client dependencies
cd client
npm install
cd ..

# 4. Install Python microservice requirements
cd ml_service
pip install -r requirements.txt
cd ..
```

### Step 3: Launch All Services with One Command

```bash
node start.js
```

### Step 4: Access the Application in Your Browser
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Express Backend API**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **Python ML Microservice**: [http://127.0.0.1:5001](http://127.0.0.1:5001)

---

## 🛠️ Running Individual Services (Manual Setup)

If you prefer to run each service in a separate terminal:

### Terminal 1: Python Flask ML & Scraping Service (Port 5001)
```bash
cd "d:\EcomProject Copy\ecommerce-purchase-intent-prediction\ecommerce-mern-platform\ml_service"
python service.py
```
*Outputs: `Serving Flask app 'service' on http://127.0.0.1:5001`*

### Terminal 2: Node.js Express Backend (Port 5000)
```bash
cd "d:\EcomProject Copy\ecommerce-purchase-intent-prediction\ecommerce-mern-platform\server"
npm start
```
*Outputs: `[Express Server] Running on http://127.0.0.1:5000 | [MongoDB] Connected to database`*

### Terminal 3: React + Vite Frontend (Port 3000)
```bash
cd "d:\EcomProject Copy\ecommerce-purchase-intent-prediction\ecommerce-mern-platform\client"
npm run dev
```
*Outputs: `VITE ready in 700ms ➜ Local: http://localhost:3000/`*

---

## 🗄️ Database Configuration (MongoDB Atlas)

The MongoDB Atlas connection is configured in [`server/.env`](file:///d:/EcomProject%20Copy/ecommerce-purchase-intent-prediction/ecommerce-mern-platform/server/.env):

```env
PORT=5000
MONGODB_URI=mongodb+srv://wizardo7699_db_user:K5m6M3JgM9hT9R2v@cluster0.db7ntvk.mongodb.net/ecom_intent_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super_secret_ecom_intent_jwt_key_2026
ML_SERVICE_URL=http://127.0.0.1:5001
```

> **Note**: The backend automatically falls back to an in-memory store if MongoDB Atlas is momentarily unreachable, ensuring seamless user experience.

---

## 📁 Project Directory Structure

```
ecommerce-purchase-intent-prediction/
├── ecommerce-mern-platform/
│   ├── start.js                      # All-in-one launcher for Python, Express & Vite
│   ├── client/                       # React 18 + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── LandingPage.jsx          # Home showcase & demo search bar
│   │   │   │   ├── Navbar.jsx               # Floating glassmorphic dock
│   │   │   │   ├── SearchHeader.jsx         # Search bar & store filter chips
│   │   │   │   ├── IntentGauge.jsx          # ML 4-aspect purchase intent gauge
│   │   │   │   ├── ComparisonHighlights.jsx # Lowest/Best deal recommendation cards
│   │   │   │   ├── PlatformColumns.jsx      # Amazon/Myntra/Ajio 3-column grid
│   │   │   │   ├── ProductCard.jsx          # Interactive product card
│   │   │   │   ├── PriceHistoryModal.jsx    # SVG historical price radar
│   │   │   │   ├── PriceAlertModal.jsx      # Price drop alert subscription modal
│   │   │   │   ├── AuthModal.jsx            # Sign in / Register / 1-Click Demo
│   │   │   │   ├── WishlistDrawer.jsx       # Cloud wishlist slide-out panel
│   │   │   │   ├── Toast.jsx                # Cyber alert notifications
│   │   │   │   └── SmoothLoader.jsx         # Dual-ring radar scanner skeleton
│   │   │   ├── services/
│   │   │   │   └── api.js                   # Axios client & session tracking
│   │   │   ├── App.jsx                      # Main application state & routing
│   │   │   └── index.css                    # Glassmorphism 2.0 theme tokens & animations
│   │   └── package.json
│   │
│   ├── server/                       # Node.js + Express Backend
│   │   ├── config/db.js              # MongoDB Atlas connection handler
│   │   ├── models/
│   │   │   ├── User.js               # MongoDB user schema
│   │   │   ├── Wishlist.js           # Wishlist items schema
│   │   │   └── PriceAlert.js         # Price alerts schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Register, Login, Profile
│   │   │   ├── productRoutes.js      # Multi-store search & price history
│   │   │   ├── intentRoutes.js       # ML event tracking & session intent
│   │   │   ├── wishlistRoutes.js     # User wishlist CRUD
│   │   │   └── alertRoutes.js        # Price drop alert management
│   │   ├── middleware/auth.js        # JWT verification middleware
│   │   ├── index.js                  # Express server entry point
│   │   └── .env                      # Server environment configuration
│   │
│   └── ml_service/                   # Python ML & Scraper Microservice
│       ├── src/
│       │   ├── amazon_scraper.py     # Amazon product scraper
│       │   ├── myntra_scraper.py     # Myntra catalog scraper
│       │   ├── ajio_scraper.py       # Ajio API scraper
│       │   ├── intent_service.py     # Multi-aspect session intent engine
│       │   └── predict_purchase_intent.py # LightGBM tree inference
│       ├── models/
│       │   └── lightgbm_model.pkl    # Trained LightGBM binary model
│       ├── service.py                # Flask microservice (Port 5001)
│       └── requirements.txt          # Python dependencies
│
├── data/                             # Raw & processed e-commerce datasets
├── notebooks/                        # Jupyter notebooks for model training
└── README.md                         # Project documentation
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create new account with email, name, and hashed password |
| `POST` | `/api/auth/login` | Sign in with email and password, returns JWT token |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile |

### Product Search & Price History (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products/search?query=...` | Search products across Amazon, Myntra, and Ajio |
| `GET` | `/api/products/price-history?link=...` | Retrieve historical 90-day price trends and verdict |

### ML Purchase Intent Engine (`/api/intent`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/intent/track` | Record interaction event (`product_view`, `history_view`, `wishlist_add`, etc.) |
| `GET` | `/api/intent/current` | Get current session's multi-aspect purchase probability |
| `POST` | `/api/intent/reset` | Reset session telemetry back to baseline 0% |

### Cloud Wishlist & Alerts (`/api/wishlist`, `/api/alerts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/wishlist?email=...` | Fetch user's saved wishlist items from MongoDB Atlas |
| `POST` | `/api/wishlist` | Add item to wishlist |
| `DELETE` | `/api/wishlist/:id` | Remove item from wishlist |
| `POST` | `/api/alerts` | Arm email price drop alert |

---

## 👤 Author & Research Team
- **Platform**: OmniPrice AI Purchase Intent Platform
- **Architecture**: MERN Stack + Python Flask + LightGBM Machine Learning
- **Database**: MongoDB Atlas Cloud
