# BMI Calculator App

This repository contains a BMI calculator with:

- A React frontend that gathers height, weight, and unit preferences and displays BMI results along with health suggestions.
- A Laravel backend API that validates input, performs BMI computation, and returns the BMI value, category, and tailored advice.

## Setup

1. **Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan serve
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Features

- Toggle between Metric (cm/kg) and Imperial (inches/lbs) units.
- Clean result card with BMI value, category (Underweight / Normal / Overweight), and suggestions.
- Backend validation and uniform API response.
