# Cloud Cost Tracker (MERN × AWS)

## Overview

**Cloud Cost Tracker** is a full-stack web application designed to help developers and small teams monitor their cloud resource usage and estimated infrastructure costs.
The project combines the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with **AWS cloud services** to build a dashboard that provides insights into resource utilization, cost trends, and idle infrastructure.

The goal of this project is to simulate a **FinOps-style monitoring platform** similar to cloud cost management tools used by modern companies.

---

## Problem Statement

Cloud platforms allow developers to deploy infrastructure quickly, but it is easy to forget running resources such as EC2 instances, storage buckets, or other services.
This often leads to unexpected charges.

This project helps solve this problem by providing:

* Visibility into cloud resource usage
* Estimated cost tracking
* Idle resource detection
* Alerts for abnormal spending

---

## Key Features

### 1. Dashboard

* Displays overall cloud spending and usage summary
* Shows running infrastructure resources
* Provides quick insights into system health

Example metrics displayed:

* Total estimated cost
* Number of running EC2 instances
* Idle resources detected
* Active alerts

---

### 2. Resource Monitoring

* View a list of AWS resources being monitored
* Track CPU usage and runtime
* Estimate infrastructure cost per resource
* Perform actions such as stop or restart instances

---

### 3. Cost Analytics

* Visualize cost distribution across cloud services
* Track daily or monthly spending trends
* Identify which services contribute the most to cost

Charts include:

* Cost by service
* Monthly cost trend
* Resource usage analytics

---

### 4. Alerts & Notifications

The system generates alerts when abnormal activity occurs.

Examples:

* Idle EC2 instances
* High estimated monthly cost
* Low CPU utilization

Alerts can be delivered through:

* Dashboard notifications
* Email alerts

---

### 5. AWS Integration

The application connects to AWS services to fetch infrastructure metrics and usage information.

Example data sources:

* EC2 instance status
* CPU utilization metrics
* resource runtime
* estimated cost information

---

## Technology Stack

### Frontend

* React.js
* Tailwind CSS
* Chart.js / Recharts
* Axios
* React Router

### Backend

* Node.js
* Express.js
* AWS SDK

### Database

* MongoDB Atlas

### Cloud Services

* AWS EC2 (resource monitoring)
* AWS CloudWatch (metrics)
* AWS Lambda (scheduled analysis)
* AWS SNS (alert notifications)
* AWS S3 (optional logs)

---

## System Architecture

User interacts with the web dashboard which communicates with a backend API.
The backend fetches metrics from AWS services and stores usage data in MongoDB.

Flow:

User Browser
↓
React Frontend
↓
Node.js / Express API
↓
AWS SDK
↓
AWS Services (EC2, CloudWatch)
↓
MongoDB Atlas

---

## Project Structure

```
cloud-cost-tracker
│
├── client
│   ├── pages
│   │   ├── Dashboard
│   │   ├── Resources
│   │   ├── Analytics
│   │   ├── Alerts
│   │   └── Settings
│   │
│   ├── components
│   │   ├── Sidebar
│   │   ├── Navbar
│   │   ├── Charts
│   │   └── Tables
│   │
│   └── services
│       └── api.js
│
├── server
│   ├── controllers
│   ├── routes
│   ├── services
│   └── awsIntegration
│
├── database
│   └── models
│
└── scripts
    └── resourceScanner
```

---

## Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/cloud-cost-tracker.git
cd cloud-cost-tracker
```

### 2. Install dependencies

Backend:

```
cd server
npm install
```

Frontend:

```
cd client
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the server directory.

Example configuration:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_REGION=your_region
```

---

### 4. Run the Application

Backend:

```
npm run dev
```

Frontend:

```
npm start
```

---

## Future Improvements

Possible enhancements for this project include:

* Automatic shutdown of idle EC2 instances
* Multi-cloud support (AWS, Azure, GCP)
* AI-based cost prediction
* SaaS multi-tenant architecture
* Kubernetes monitoring
* advanced FinOps analytics

---

## Learning Outcomes

This project helps developers gain experience with:

* Full-stack MERN development
* Cloud infrastructure monitoring
* AWS SDK integration
* DevOps and FinOps concepts
* Building SaaS-style dashboards

---

