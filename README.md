# ResQNet - Disaster Management and Emergency Response Coordination System

## Overview

ResQNet is a full-stack Disaster Management and Emergency Response Coordination System designed to connect citizens, responders, and administrators during emergency situations. The platform enables disaster reporting, responder assignment, real-time monitoring, alert management, and incident resolution tracking.

---

## Features

### Authentication & Authorization

* JWT-based Authentication
* Role-Based Access Control
* Secure Login & Registration

### Citizen Module

* Report disasters and emergencies
* View disaster status updates
* Receive emergency alerts
* Track submitted reports

### Admin Module

* Monitor all reported disasters
* Assign responders to incidents
* Create and manage alerts
* View analytics dashboard
* Monitor completed incidents

### Responder Module

* View assigned incidents
* Update incident status
* Mark incidents as In Progress
* Upload resolution proof images
* Add resolution notes
* Resolve incidents

### Analytics Dashboard

* Disaster Status Distribution (Pie Chart)
* Severity Analysis (Bar Chart)
* Real-time statistics and KPIs

### Real-Time Updates

* WebSocket-based disaster notifications
* Instant dashboard updates without page refresh

---

## Technology Stack

### Frontend

* React.js
* Axios
* React Icons
* Framer Motion
* Recharts
* SockJS
* STOMP WebSocket

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* WebSocket (STOMP)

### Database

* MySQL

### Build Tools

* Maven
* npm

---

## Project Structure

```text
ResQNet
│
├── disaster-management-frontend
│
└── disastermanagement
```

---

## Workflow

1. Citizen reports a disaster.
2. Admin reviews and assigns a responder.
3. Responder updates incident status.
4. Responder uploads proof and resolution notes.
5. Incident is marked as resolved.
6. Admin monitors completed incidents and analytics.


## Installation

### Backend

```bash
cd disastermanagement
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd disaster-management-frontend
npm install
npm start
```

---

## Future Scope

* AI-based disaster prediction
* Mobile application
* SMS and Email notifications
* GIS integration
* Cloud deployment

---

## Author

**Vandana Raghunandan**

Disaster Management and Emergency Response Coordination System (ResQNet)
