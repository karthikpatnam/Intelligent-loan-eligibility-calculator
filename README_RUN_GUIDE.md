# Getting Started: Intelligent Loan Eligibility Calculator

Follow these steps to launch the application. This project consists of a **React frontend** and a **Node.js/Express backend** connected to **MongoDB Atlas**.

## 1. Prerequisites
Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   npm (installed automatically with Node.js)

---

## 2. Backend Setup
The backend handles authentication and the loan underwriting engine.

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Ensure your `.env` file exists in the `backend` folder with the following content (I have already configured this for you):
    ```env
    PORT=5001
    MONGODB_URI=mongodb+srv://kuser:kuser123@cluster0.nmewob8.mongodb.net/loan_calculator?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=loan_engine_secret_key_2024
    ```
4.  **Start the server**:
    ```bash
    npm start
    ```
    *The server will run on `http://localhost:5001`. You should see "✅ Connected to MongoDB" in the console.*

---

## 3. Frontend Setup
The frontend provides the premium wizard interface and dashboard.

1.  **Open a new terminal and navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the development server**:
    ```bash
    npm run dev
    ```
    *The app will typically be available at `http://localhost:5173`.*

---

## 4. Usage Tips
*   **Registration**: Create a new account using the "Register" tab on the landing page.
*   **New Analysis**: Navigate to the "New Analysis" section to start the multi-step loan wizard.
*   **History**: After completing an analysis, click "Finish & Save" to persist the data to MongoDB. You can then view the full report at any time from the "History" tab.
*   **Reports**: Use the "Save PDF" or "Download Report" buttons to generate a printable financial summary.
