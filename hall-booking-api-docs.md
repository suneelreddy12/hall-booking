# Hall Booking API Documentation

This document provides details about the API endpoints for the Hall Booking application, including how to create rooms, book rooms, and retrieve booking data.

## Endpoints

### 1. Create a Room

- **Endpoint**: `/rooms`
- **Method**: `POST`
- **Description**: Creates a new room with the specified number of seats, amenities, and price per hour.

#### Request

- **Headers**:  
  `Content-Type: application/json`

- **Body**: A JSON object that includes the number of seats, amenities, and price per hour.
  ```sample json
  {
    "numberOfSeats": 10,
    "amenities": ["WiFi", "Projector"],
    "pricePerHour": 100
  }
  ```
