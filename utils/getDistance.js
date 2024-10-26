import dotenv from "dotenv";
dotenv.config();
export const getDistance = async (origin, destination) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.rows?.[0]?.elements?.[0].distance.value;
};
