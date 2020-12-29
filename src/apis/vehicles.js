export const getVehicles = async () => {
  const vehicles = [];
  try {
    const res = await fetch(process.env.REACT_APP_VEHICLE_URL)
    vehicles.push(...await res.json());
  } catch (ex) {
    // do nothing
  }
  return vehicles;
};
