import { mountWithState, mockStore } from '../../utils/testUtil';
import ErrorDialog from '../errorDialog/errorDialog';
import { DialogTitle, DialogContent, Button } from '@material-ui/core';

describe('invoked error Dialog', () => {
	it('nothing render when open is false', () => {
		const errorDialogComponent = mountWithState(<ErrorDialog open={false} />, mockStore);
		const dialogTitle = errorDialogComponent.find(DialogTitle);
		const dialogContent = errorDialogComponent.find(DialogContent);
		const dialogButton = errorDialogComponent.find(Button);
		expect(dialogTitle).toHaveLength(0);
		expect(dialogContent).toHaveLength(0);
		expect(dialogButton).toHaveLength(0);
	});

	it('render properly when open is true', () => {
		const errorDialogComponent = mountWithState(<ErrorDialog open={true} />, mockStore);
		const dialogTitle = errorDialogComponent.find(DialogTitle);
		const dialogContent = errorDialogComponent.find(DialogContent);
		const dialogButton = errorDialogComponent.find(Button);

		expect(dialogTitle.text()).toBe('Unexpected Error');
		expect(dialogContent.text()).toBe('Oops! Something went wrong. Please try again later...');
		expect(dialogButton).toHaveLength(1);
		expect(dialogButton.text()).toBe('Refresh');
	});

	it('page refresh when click on refresh', () => {
		delete window.location;
		window.location = { reload: jest.fn() };
		const errorDialogComponent = mountWithState(<ErrorDialog open={true} />, mockStore);
		const dialogButton = errorDialogComponent.find(Button);
		dialogButton.simulate('click', {});
		expect(window.location.reload).toHaveBeenCalled();
	});
});
