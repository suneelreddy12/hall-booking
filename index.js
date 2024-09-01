const express = require("express");
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = process.env.PORT || 3000;

// In-memory data storage
let rooms = [];
let bookings = [];

// 1. Creating a Room
app.post("/rooms", (req, res) => {
  const { numberOfSeats, amenities, pricePerHour } = req.body;
  const newRoom = {
    roomId: rooms.length + 1,
    numberOfSeats,
    amenities,
    pricePerHour,
  };
  rooms.push(newRoom);
  res.status(201).json({ message: "Room created successfully", room: newRoom });
});

// Book a Room
app.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  // Check if the room exists
  const roomExists = rooms.some((room) => room.roomId === roomId);
  if (!roomExists) {
    return res
      .status(404)
      .json({ message: "Room not found with the provided room ID" });
  }

  // Check if room is available
  const isRoomAvailable = bookings.every((booking) => {
    return (
      booking.roomId !== roomId ||
      booking.date !== date ||
      booking.startTime >= endTime ||
      booking.endTime <= startTime
    );
  });

  if (!isRoomAvailable) {
    return res
      .status(400)
      .json({ message: "Room is not available at the selected time" });
  }

  const newBooking = {
    bookingId: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };

  bookings.push(newBooking);
  res
    .status(201)
    .json({ message: "Room booked successfully", booking: newBooking });
});

// 3. List all Rooms with Booking Data
app.get("/rooms", (req, res) => {
  const roomData = rooms.map((room) => {
    const bookedData = bookings.filter(
      (booking) => booking.roomId === room.roomId
    );
    return {
      roomName: `Room ${room.roomId}`,
      bookedStatus: bookedData.length > 0 ? "Booked" : "Available",
      bookings: bookedData,
    };
  });
  res.json(roomData);
});

// 4. List all Customers with Booked Data
app.get("/customers", (req, res) => {
  const customerData = bookings.map((booking) => {
    const room = rooms.find((room) => room.roomId === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: `Room ${room.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(customerData);
});

// 5. List How Many Times a Customer has Booked the Room
app.get("/customer-bookings/:customerName", (req, res) => {
  const { customerName } = req.params;
  const customerBookings = bookings.filter(
    (booking) =>
      booking.customerName.toLowerCase() === customerName.toLowerCase()
  );
  const customerData = customerBookings.map((booking) => {
    const room = rooms.find((room) => room.roomId === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: `Room ${room.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.bookingId,
      bookingStatus: "Confirmed",
    };
  });
  res.json(customerData);
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
