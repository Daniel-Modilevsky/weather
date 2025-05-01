# Weather Alert System

A full-stack application that monitors weather conditions and triggers alerts based on user-defined thresholds. Built with React, Node.js, PostgreSQL, and Redis.

## Features

- Real-time weather monitoring using Tomorrow.io API
- User-defined weather alerts with customizable thresholds
- Background evaluation of alert conditions
- Modern, responsive UI with Material-UI
- Real-time alert status updates
- Reliable data persistence with PostgreSQL
- Efficient caching and job queuing with Redis
- Containerized with Docker for easy deployment

## Architecture

The system consists of several services:

- **Client**: React frontend application
- **Server**: Node.js/Express REST API
- **Worker**: Background service for alert evaluation
- **PostgreSQL**: Primary data store
- **Redis**: Caching and job queuing
- **RabbitMQ**: Message broker for worker communication

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Tomorrow.io API key

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather-alert-system
   ```

2. Create a `.env` file in the root directory:

   ```env
   TOMORROW_API_KEY=your_api_key_here
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=weather
   REDIS_HOST=redis
   REDIS_PORT=6379
   ```

3. Start the services:

   ```bash
   docker-compose up
   ```

4. Access the application:
   - Frontend: http://localhost
   - API: http://localhost:3000
   - RabbitMQ Management: http://localhost:15672
   - pgAdmin: http://localhost:5050

## Development

For local development:

1. Install dependencies:

   ```bash
   # In client directory
   cd client && npm install

   # In server directory
   cd server && npm install

   # In worker directory
   cd worker && npm install
   ```

2. Start development servers:

   ```bash
   # Start client
   cd client && npm run dev

   # Start server
   cd server && npm run dev

   # Start worker
   cd worker && npm run dev
   ```

## API Documentation

### Alerts

- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/:id` - Update an alert
- `DELETE /api/alerts/:id` - Delete an alert
- `POST /api/alerts/check-all` - Trigger alert evaluation
- `GET /api/alerts/evaluation/:batchId` - Get evaluation status

### Weather

- `GET /api/weather?location=:location` - Get current weather for location

## Database Schema

### Alerts Table

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    parameter VARCHAR(50),
    condition VARCHAR(20),
    threshold DECIMAL(10,2),
    unit VARCHAR(10),
    is_triggered BOOLEAN,
    state VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_checked TIMESTAMP
);
```

## Requirements Coverage

1. ✅ Tomorrow.io API Integration

   - Real-time weather data fetching
   - Location support (city name and coordinates)
   - Essential weather parameters exposed

2. ✅ Alert Creation API

   - RESTful endpoints for CRUD operations
   - Comprehensive alert model
   - PostgreSQL persistence

3. ✅ Alert Evaluation Service

   - Background worker with RabbitMQ
   - Periodic evaluation (every 10 minutes)
   - State tracking and persistence

4. ✅ Frontend Application
   - Modern React UI with Material-UI
   - Real-time updates
   - Three main sections:
     - Home: Current weather display
     - Alerts: Alert management
     - Status: Real-time alert status

## Future Improvements

1. User authentication and authorization
2. Email/SMS notifications for triggered alerts
3. Historical alert data and analytics
4. More granular alert conditions
5. Weather forecast integration
6. Geolocation support
7. Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
