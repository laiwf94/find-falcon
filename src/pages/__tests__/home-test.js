import { mountWithState, mockStore } from '../../utils/testUtil';
import Home from '../home/home';
import Button from '../../ui/button/button';

describe('invoked Home page', () => {
	it('properly render home page', () => {
		const homeComponent = mountWithState(<Home />, mockStore, ['/home']);
		const buttons = homeComponent.find(Button);

		expect(buttons).toHaveLength(2);
		expect(buttons.first().text()).toBe('Form');
		expect(buttons.last().text()).toBe('Github');
	});
});
