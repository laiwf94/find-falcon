export const getPlanets = async () => {
  const planets = [];
  try {
    const res = await fetch(process.env.REACT_APP_PLANET_URL)
    planets.push(...await res.json());
  } catch (ex) {
    // do nothing
  }
  return planets;
};