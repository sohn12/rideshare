# Driver Locator

> Node/Express/Mongo API with GeoJSON location field for driver locations. Simple vanilla JS frontend using the Mapbox Library

## Quick Start

Add your MONGO_URI and GEOCODER_API_KEY to the "config/config.env" file.

```bash
# Install dependencies
npm install

# Serve on localhost:5000
npm run dev (nodemon)
or
npm start

# Routes
GET    /api/v1/drivers # Get drivers

POST   /api/v1/drivers # Add driver
body { driverId: "0001", address: "10 main st Boston MA" }
```
#   r i d e s h a r e 
 
 