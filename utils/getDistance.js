import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const getDistance = async (origin, destination) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.rows?.[0]?.elements?.[0].distance.value;
};

export const getDistanceFromCoords = async (origin, destination) => {
  // Helper function to get coordinates of an address
  async function getCoordinates(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error(`Error: ${response.data.status}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching geocode: ${error}`);
      return null;
    }
  }

  // Function to get distance between two addresses
  async function getDistanceBetweenAddresses(address1, address2) {
    const coords1 = await getCoordinates(address1);
    const coords2 = await getCoordinates(address2);

    if (coords1 && coords2) {
      const distance = getDistanceFromLatLonInKm(
        coords1.lat,
        coords1.lng,
        coords2.lat,
        coords2.lng
      );
      console.log(`Distance between locations: ${distance.toFixed(2)} km`);

      return distance;
    } else {
      console.log("Could not get coordinates for one or both addresses.");
      return null;
    }
  }

  // Function to calculate distance using Haversine formula
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Degree to radian converter
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Call the function to calculate the distance
  return await getDistanceBetweenAddresses(origin, destination);
};
