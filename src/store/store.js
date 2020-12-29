import { configureStore } from '@reduxjs/toolkit';
import planetReducer from './planet/planetSlice';
import resultReducer from './result/resultSlice';
import vehicleReducer from './vehicle/vehicleSlice';
import historyPlanet from './history/historySlice';

export default configureStore({
  reducer: {
    planet: planetReducer,
    vehicle: vehicleReducer,
    result: resultReducer,
    history: historyPlanet,
  },
});
