import fetchMock from 'fetch-mock';
import { act } from 'react-dom/test-utils';
import { fetchPlanets, planetSlice } from '../../store/planet/planetSlice';
import { fetchVehicles, vehicleSlice } from '../../store/vehicle/vehicleSlice';
import { mockStore, mountWithState } from '../../utils/testUtil';
import Form from '../form/form';
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

const mockResult = { planet_name: 'TEST_PLANET', status: 'success' };
const mockToken = { token: 'testtoken' };

fetchMock.getOnce(process.env.REACT_APP_PLANET_URL, {
	body: [...mockPlanets],
	headers: { 'content-type': 'application/json' },
});

fetchMock.getOnce(process.env.REACT_APP_VEHICLE_URL, {
	body: [...mockVehicles],
	headers: { 'content-type': 'application/json' },
});

fetchMock.postOnce(process.env.REACT_APP_FIND_URL, {
	body: { ...mockResult },
	headers: { 'content-type': 'application/json' },
});

fetchMock.postOnce(process.env.REACT_APP_TOKEN_URL, {
	body: { ...mockToken },
	headers: { 'content-type': 'application/json' },
});

describe('invoked Form Page', () => {
	beforeAll(async () => {
		const planetResult = await mockStore.dispatch(fetchPlanets());
		
		const vehicleResult = await mockStore.dispatch(fetchVehicles());
		// dispatch correct state
		expect(planetResult.payload).toEqual(mockPlanets);
		expect(planetResult.type).toBe('planet/fetchPlanets/fulfilled');

		expect(vehicleResult.payload).toEqual(mockVehicles);
		expect(vehicleResult.type).toBe('vehicle/fetchVehicles/fulfilled');

		// contains correct state
		expect(mockStore.getState().planet.all).toEqual(mockPlanets);
		expect(mockStore.getState().vehicle.all).toEqual(mockVehicles);
	});

	afterAll(() => {
		fetchMock.restore();
	});

	it('Form page rendered properly', () => {
		const formComponent = mountWithState(<Form />, mockStore, ['/form']);
		const h1 = formComponent.find('h1');
		expect(h1.text()).toBe('SELECT PLANETS AND VECHILES TO FIND FALCON');

		const span = formComponent.find('span.findFalcon');
		expect(span.text()).toBe('Find Falcon');
		expect(span.props()['aria-disabled']).toBeTruthy();

		// layout and components render properly
		const layout = formComponent.find('.layout');
		expect(layout).toBeTruthy();
		expect(layout.find('.selections')).toBeTruthy();
		expect(layout.find('.infobar')).toBeTruthy();
	});

	it('Form page cannot redirects when find button disabled', () => {
		const formComponent = mountWithState(<Form />, mockStore, ['/form']);

		const a = formComponent.find('a');
		expect(a).toHaveLength(0);
	});

	it('Form page find button enabled when page valid', async () => {
		const formComponent = mountWithState(<Form />, mockStore, ['/form']);

		mockStore.dispatch(planetSlice.actions.planetUse({ index: 0, planet: 'Donlon' }));
		mockStore.dispatch(planetSlice.actions.planetUse({ index: 1, planet: 'Donlon' }));
		mockStore.dispatch(planetSlice.actions.planetUse({ index: 2, planet: 'Donlon' }));
		mockStore.dispatch(planetSlice.actions.planetUse({ index: 3, planet: 'Donlon' }));

		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 0, vehicle: 'Space pod' }));
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 1, vehicle: 'Space pod' }));
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 2, vehicle: 'Space pod' }));
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 3, vehicle: 'Space pod' }));

		formComponent.update();

		const a = formComponent.find('a.findFalcon');
		expect(a.props()['aria-disabled']).toBeFalsy();
		a.simulate('click', {});
		await act(async () => {
			await Promise.resolve(formComponent);
			await new Promise((resolve) => setImmediate(resolve));
			formComponent.update();
		});
		expect(mockStore.getState().result).toEqual({ planetName: 'TEST_PLANET', timeTaken: 200, status: 'success' });
	});
});
