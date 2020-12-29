import { mockStore, mountWithState } from '../../utils/testUtil';
import Header from '../header/header';
import Button from '../../ui/button/button';
import { planetSlice } from '../../store/planet/planetSlice';
import { vehicleSlice } from '../../store/vehicle/vehicleSlice';

describe('invoke header component', () => {
	it('component properly render', () => {
		const headerComponent = mountWithState(<Header />, mockStore);
		const strong = headerComponent.find('strong');
		expect(strong.text()).toBe('FIND FALCON');
		const buttons = headerComponent.find(Button);
		expect(buttons).toHaveLength(0);
	});

	it('home and reset button appears on home page', () => {
		const headerComponent = mountWithState(<Header />, mockStore, ['/form']);
		const button = headerComponent.find(Button);
		expect(button).toHaveLength(2);
		expect(button.first().text()).toBe('Reset');
		expect(button.last().text()).toBe('Home');
	});

	it('home button appears on result page', () => {
		const headerComponent = mountWithState(<Header />, mockStore, ['/result']);
		const button = headerComponent.find(Button);
		expect(button).toHaveLength(1);
		expect(button.first().text()).toBe('Home');
	});

	it('planet and vehicle rest on click', () => {
		mockStore.dispatch(planetSlice.actions.planetUse({index: 0, planet: 'TEST_PLANET'}));
		mockStore.dispatch(vehicleSlice.actions.vehicleUse({index: 0, vehicle: 'TEST_VEHICLE'}));
    const headerComponent = mountWithState(<Header />, mockStore, ['/form'])
    const button = headerComponent.find(Button);

    // state was set
    expect(mockStore.getState().vehicle.use[0]).toBe('TEST_VEHICLE');
    expect(mockStore.getState().planet.use[0]).toBe('TEST_PLANET');

    button.first().simulate('click', {});
    
    expect(mockStore.getState().vehicle.use[0]).toBeUndefined();
    expect(mockStore.getState().planet.use[0]).toBeUndefined();
	});
});
