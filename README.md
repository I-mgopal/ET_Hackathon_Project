# 💰 ET AI Money Mentor

A powerful AI-driven financial advisor built for the Indian market. It helps users compare tax regimes (Old vs New FY 2025-26), provides a "Money Health Score", and offers personalized advisory on tax-saving instruments.

Uses **GroqCloud (Llama 3 70B)** for lightning-fast financial analysis across 4 specialized AI agents.

---

## 🚀 Quick Start (Using Docker) - Fastest Way

The easiest way to get the app running locally is using Docker Compose.

### 1. Clone the repository
```bash
git clone https://github.com/I-mgopal/ET_Hackathon_Project.git
cd ET_Hackathon_Project
```

### 2. Configure Environment Variables
Copy the example environment file and add your Groq API Key:
```bash
cp .env.example .env
# Open .env and add:
# GROQ_API_KEY=your_gsk_key_here
```

### 3. Build and Run
```bash
docker-compose up --build
```

**Access the App:**
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:8000](http://localhost:8000)
*   **MongoDB**: Running on port `27017`

---

## 🛠️ Manual Installation (Without Docker)

If you prefer to run the components separately, follow these steps:

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **MongoDB** (Local or Atlas)

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create a .env file inside 'backend' folder
# Add: GROQ_API_KEY, MONGO_URL, DB_NAME
uvicorn server:app --reload
```

### 2. Setup Frontend
```bash
cd frontend
yarn install  # or npm install
# Create a .env file inside 'frontend' folder
# Add: REACT_APP_BACKEND_URL=http://localhost:8000
yarn start
```

---

## ⭐ Features

*   **📊 Tax Regime Comparison**: Side-by-side analysis of Old vs New regime for FY 2025-26 with visual bar charts.
*   **🩺 Money Health Score**: 0-100 score based on Emergency Fund, Insurance, Tax Efficiency, and more.
*   **🧠 Multi-Agent Workflow**:
    1.  **Profiler Agent**: Validates and enriches user financial data.
    2.  **Scorer Agent**: Calculates financial wellness metrics.
    3.  **Tax Calculator Agent**: Performs precise Indian tax computation.
    4.  **Advisory Agent**: Identifies missed tax savings and recommends investments.
*   **⚡ Groq Integration**: Sub-second AI reasoning using the Llama 3 70B model.

---

## 🧼 Cleanup & Management
To stop everything:
```bash
docker-compose down
```
To clear the database:
```bash
docker-compose down -v
```

---
Built during ET Hackathon 2024.
