import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import fetchMock from 'fetch-mock';
import { fetchPlanets, planetSlice } from '../../store/planet/planetSlice';
import { fetchVehicles, vehicleSlice } from '../../store/vehicle/vehicleSlice';
import { mockStore, mountWithState } from '../../utils/testUtil';
import PlanetSelection from '../selections/planetSelection/planetSelection';

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

describe('invoked planetSelection component', () => {
	beforeEach(async () => {
		fetchMock.get(process.env.REACT_APP_PLANET_URL, {
			body: [...mockPlanets],
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.get(process.env.REACT_APP_VEHICLE_URL, {
			body: [...mockVehicles],
			headers: { 'content-type': 'application/json' },
		});

		const planetResult = await mockStore.dispatch(fetchPlanets());

		// dispatch correct state
		expect(planetResult.payload).toEqual(mockPlanets);
		expect(planetResult.type).toBe('planet/fetchPlanets/fulfilled');

		// contains correct state
		expect(mockStore.getState().planet.all).toEqual(mockPlanets);
	});

	afterEach(() => {
		fetchMock.restore();
		mockStore.dispatch(planetSlice.actions.reset());
	});

	it('PlanetSelection component rendered properly', () => {
		const planetSelectionComponent = mountWithState(<PlanetSelection planets={mockStore.getState().planet.available} index={0} />, mockStore, ['/form']);
		const autoCompleteForm = planetSelectionComponent.find(Autocomplete);
		expect(autoCompleteForm.props().options).toEqual(mockPlanets);
		const autoCompleteTextField = planetSelectionComponent.find(TextField);
		expect(autoCompleteTextField).toBeTruthy();
	});

	it('dispatch planetUse on change', () => {
		const planetSelectionComponent = mountWithState(<PlanetSelection planets={mockStore.getState().planet.available} index={0} />, mockStore, ['/form']);
		const autoCompleteForm = planetSelectionComponent.find(Autocomplete);
		const autoCompleteTextField = planetSelectionComponent.find(TextField);
		autoCompleteTextField.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'Enter' });
		planetSelectionComponent.update();
		autoCompleteForm.update();
		autoCompleteTextField.update();
		// planet set
		expect(mockStore.getState().planet.use[0]).toBe('Enchai');
	});

	it('unselect vehicle if planet distance is larger than the vehicle max travel distance', async () => {
		await mockStore.dispatch(fetchVehicles());
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 0, vehicle: 'Space pod' }));
		const planetSelectionComponent = mountWithState(<PlanetSelection planets={mockStore.getState().planet.available} index={0} />, mockStore, ['/form']);
		const autoCompleteForm = planetSelectionComponent.find(Autocomplete);
		const autoCompleteTextField = planetSelectionComponent.find(TextField);

		// check it was set
		expect(mockStore.getState().vehicle.use[0]).toBe('Space pod');

		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'Enter' });
		planetSelectionComponent.update();
		autoCompleteForm.update();
		autoCompleteTextField.update();

		// new planet set, and vehicle unset
		expect(mockStore.getState().planet.use[0]).toBe('Sapir');
		expect(mockStore.getState().vehicle.use[0]).toBeUndefined();
	});

	it('can remove selection from text field', async () => {
		await mockStore.dispatch(fetchVehicles());
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 0, vehicle: 'Space pod' }));
		const planetSelectionComponent = mountWithState(<PlanetSelection planets={mockStore.getState().planet.available} index={0} />, mockStore, ['/form']);
		const autoCompleteForm = planetSelectionComponent.find(Autocomplete);
		const autoCompleteTextField = planetSelectionComponent.find(TextField);
		const autoCompleteInput = autoCompleteTextField.find('input');

		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'ArrowDown' });
		autoCompleteForm.simulate('keyDown', { key: 'Enter' });
		planetSelectionComponent.update();

		// set to Enchai
		expect(mockStore.getState().planet.use[0]).toBe('Enchai');

		// remove from textfield
		autoCompleteInput.simulate('change', { target: { value: '' } });
		planetSelectionComponent.update();

		// planet unset
		expect(mockStore.getState().planet.use[0]).toBe('');
	});
});
