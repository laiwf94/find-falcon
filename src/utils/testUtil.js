
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Enzyme from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { configureStore } from '@reduxjs/toolkit';
import planetReducer from '../store/planet/planetSlice';
import resultReducer from '../store/result/resultSlice';
import vehicleReducer from '../store/vehicle/vehicleSlice';
import historyPlanet from '../store/history/historySlice';

Enzyme.configure({ adapter: new Adapter() });
const { mount: enzymeMount } = Enzyme;

export const mountWithState = (Component, mockStore, initialEntries = ['/'], mount = enzymeMount) =>
	mount(
		<Provider store={mockStore}>
			<MemoryRouter initialEntries={initialEntries} initialIndex={0}>
				{Component}
			</MemoryRouter>
		</Provider>,
	);

export const mockStore = configureStore({
  reducer: {
    planet: planetReducer,
    vehicle: vehicleReducer,
    result: resultReducer,
    history: historyPlanet,
  },
});
