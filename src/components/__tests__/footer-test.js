import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { mockStore, mountWithState } from '../../utils/testUtil';
import Footer from '../footer/footer';

describe('invoke footer component', () => {
	it('component properly render', () => {
		const footerComponent = mountWithState(<Footer />, mockStore, ['/']);
		const bottomNavigation = footerComponent.find(BottomNavigation);
		const bottomNavigationAction = footerComponent.find(BottomNavigationAction);
		expect(bottomNavigation).toHaveLength(1);
		expect(bottomNavigation.props().value).toBe(-1);
		expect(bottomNavigationAction).toHaveLength(3);
		expect(bottomNavigationAction.first().props().label).toBe('Recents');
		expect(bottomNavigationAction.at(1).props().label).toBe('Success');
		expect(bottomNavigationAction.last().props().label).toBe('Failed');
	});

	it('bottom navigation value change on click', () => {
		const footerComponent = mountWithState(<Footer />, mockStore, ['/']);
		const bottomNavigation = footerComponent.find(BottomNavigation);

		expect(bottomNavigation).toHaveLength(1);
		expect(bottomNavigation.props().value).toBe(-1);

		const bottomNavigationAction = footerComponent.find(BottomNavigationAction);

		bottomNavigationAction.first().simulate('click', {});
		footerComponent.update();
		expect(footerComponent.find(BottomNavigation).props().value).toBe(0);

		bottomNavigationAction.at(1).simulate('click', {});
		footerComponent.update();
		expect(footerComponent.find(BottomNavigation).props().value).toBe(1);

		bottomNavigationAction.last().simulate('click', {});
		footerComponent.update();
		expect(footerComponent.find(BottomNavigation).props().value).toBe(2);
	});
});
