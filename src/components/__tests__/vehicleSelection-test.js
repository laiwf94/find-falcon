import fetchMock from 'fetch-mock';
import { fetchPlanets, planetSlice } from '../../store/planet/planetSlice';
import { fetchVehicles, vehicleSlice } from '../../store/vehicle/vehicleSlice';
import { mockStore, mountWithState } from '../../utils/testUtil';
import VehicleSelection from '../selections/vehicleSelection/vehicleSelection';
import RadioButton from '../../ui/radioButton/radioButton';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useHistory: () => ({
		push: mockHistoryPush,
	}),
}));

const mockPlanets = [
	{ name: 'Donlon', distance: 100 },
	{ name: 'Enchai', distance: 200 },
	{ name: 'Jebing', distance: 300 },
	{ name: 'Sapir', distance: 400 },
	{ name: 'Lerbin', distance: 500 },
	{ name: 'Pingasor', distance: 600 },
];
const mockVehicles = [
	{ name: 'Space pod', total_no: 2, max_distance: 200, speed: 2 },
	{ name: 'Space rocket', total_no: 1, max_distance: 300, speed: 4 },
	{ name: 'Space shuttle', total_no: 1, max_distance: 400, speed: 5 },
	{ name: 'Space ship', total_no: 2, max_distance: 600, speed: 10 },
];

describe('invoked vehicleSelection component', () => {
	beforeEach(async () => {
		fetchMock.get(process.env.REACT_APP_PLANET_URL, {
			body: [...mockPlanets],
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.get(process.env.REACT_APP_VEHICLE_URL, {
			body: [...mockVehicles],
			headers: { 'content-type': 'application/json' },
		});

		const vehicleResult = await mockStore.dispatch(fetchVehicles());

		// dispatch correct state
		expect(vehicleResult.payload).toEqual(mockVehicles);
		expect(vehicleResult.type).toBe('vehicle/fetchVehicles/fulfilled');

		// contains correct state
		expect(mockStore.getState().vehicle.all).toEqual(mockVehicles);
	});

	afterEach(() => {
		fetchMock.restore();
		mockStore.dispatch(vehicleSlice.actions.reset());
	});

	it('VehicleSelection component rendered properly', () => {
		const vehicleSelectionComponent = mountWithState(<VehicleSelection vehicles={mockStore.getState().vehicle.available} index={0} />, mockStore, ['/form']);
		const radio = vehicleSelectionComponent.find(RadioButton);

		// render all 4 radio button
		expect(radio).toHaveLength(4);
		expect(radio.first().props().value).toBe('Space pod');
		expect(radio.at(1).props().value).toBe('Space rocket');
		expect(radio.at(2).props().value).toBe('Space shuttle');
		expect(radio.last().props().value).toBe('Space ship');
	});

	it('unable to select if radio button is disabled', () => {
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 1, vehicle: 'Space shuttle' }));
		const vehicleSelectionComponent = mountWithState(<VehicleSelection vehicles={mockStore.getState().vehicle.available} index={0} />, mockStore, ['/form']);
		const radio = vehicleSelectionComponent.find("input[value='Space shuttle']");
		expect(radio.first().props().disabled).toBeTruthy();
		radio.simulate('click', {});
		expect(mockStore.getState().vehicle.use[0]).toBeUndefined();
	});

	it('radio button disabled if it is all Used', () => {
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 1, vehicle: 'Space shuttle' }));
		const vehicleSelectionComponent = mountWithState(<VehicleSelection vehicles={mockStore.getState().vehicle.available} index={0} />, mockStore, ['/form']);
		const radio = vehicleSelectionComponent.find("input[value='Space shuttle']");
		expect(radio.first().props().disabled).toBeTruthy();
	});

	it('radio button disabled if it is too far', async () => {
		await mockStore.dispatch(fetchPlanets());
		mockStore.dispatch(planetSlice.actions.planetUse({ index: 0, planet: 'Pingasor' }));
		const vehicleSelectionComponent = mountWithState(<VehicleSelection vehicles={mockStore.getState().vehicle.available} index={0} />, mockStore, ['/form']);
		const radio = vehicleSelectionComponent.find("input[value='Space shuttle']");
		expect(radio.first().props().disabled).toBeTruthy();
	});

	it('VehicleSelection component dispatch vehicleUse on click', () => {
		const vehicleSelectionComponent = mountWithState(<VehicleSelection vehicles={mockStore.getState().vehicle.available} index={0} />, mockStore, ['/form']);
		const radio = vehicleSelectionComponent.find(RadioButton).at(3);
		radio.simulate('click', {});
		vehicleSelectionComponent.update();

		expect(mockStore.getState().vehicle.use[0]).toBe('Space ship');
	});
});
