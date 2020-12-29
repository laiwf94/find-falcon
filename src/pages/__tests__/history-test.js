import App from '../../App';
import { historySlice } from '../../store/history/historySlice';
import { mockStore, mountWithState } from '../../utils/testUtil';
import History from '../history/history';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useHistory: () => ({
		push: mockHistoryPush,
	}),
}));

const mockSuccessHistory = { status: 'success', planetName: 'TEST_PLANET', timeTaken: 200, timestamp: new Date().toLocaleDateString() };
const mockFailedHistory = { status: 'false', planetName: '', timeTaken: 0, timestamp: new Date().toLocaleDateString() };

describe('invoked Result Page', () => {
	beforeAll(() => {
		const successResult = mockStore.dispatch(historySlice.actions.addHistory({ ...mockSuccessHistory }));
		const failedResult = mockStore.dispatch(historySlice.actions.addHistory({ ...mockFailedHistory }));

		// dispatch correct state
		expect(successResult).toEqual({
			payload: mockSuccessHistory,
			type: 'history/addHistory',
		});

		expect(failedResult).toEqual({
			payload: mockFailedHistory,
			type: 'history/addHistory',
		});

		// history contains correct state
		expect(mockStore.getState().history).toEqual([mockSuccessHistory, mockFailedHistory]);
	});

	it('Result page rendered properly with all status', () => {
		const historyComponent = mountWithState(<History />, mockStore, ['/history']);
		const row = historyComponent.find('.row');

		// row header render properly
		const rowHeader = row.first();
		expect(rowHeader.find('.timestamp').text()).toBe('Timestamp');
		expect(rowHeader.find('.status').text()).toBe('Status');
		expect(rowHeader.find('.timeTaken').text()).toBe('Time Taken');
		expect(rowHeader.find('.planet').text()).toBe('Planet Name');

		// row success data render properly
		const rowSuccessData = row.at(1);
		expect(rowSuccessData.find('.timestamp').text()).toBe(new Date().toLocaleDateString());
		expect(rowSuccessData.find('.status').text()).toBe('success');
		expect(rowSuccessData.find('.timeTaken').text()).toBe('200');
		expect(rowSuccessData.find('.planet').text()).toBe('TEST_PLANET');

		// row failed data render properly
		const rowFailedData = row.last();
		expect(rowFailedData.find('.timestamp').text()).toBe(new Date().toLocaleDateString());
		expect(rowFailedData.find('.status').text()).toBe('false');
		expect(rowFailedData.find('.timeTaken').text()).toBe('0');
		expect(rowFailedData.find('.planet').text()).toBe('');

		// render all row
		expect(row).toHaveLength(3);
	});

	it('Result page rendered properly succecss status', () => {
		const historyComponent = mountWithState(<App />, mockStore, ['/history/success']);
		const row = historyComponent.find('.row');

		// row header render properly
		const rowHeader = row.first();
		expect(rowHeader.find('.timestamp').text()).toBe('Timestamp');
		expect(rowHeader.find('.status').text()).toBe('Status');
		expect(rowHeader.find('.timeTaken').text()).toBe('Time Taken');
		expect(rowHeader.find('.planet').text()).toBe('Planet Name');

		// row success data render properly
		const rowData = row.last();
		expect(rowData.find('.timestamp').text()).toBe(new Date().toLocaleDateString());
		expect(rowData.find('.status').text()).toBe('success');
		expect(rowData.find('.timeTaken').text()).toBe('200');
		expect(rowData.find('.planet').text()).toBe('TEST_PLANET');

		// only render success row
		expect(row).toHaveLength(2);
	});

	it('Result page rendered properly failed status', () => {
		const historyComponent = mountWithState(<App />, mockStore, ['/history/false']);
		const row = historyComponent.find('.row');

		// row header render properly
		const rowHeader = row.first();
		expect(rowHeader.find('.timestamp').text()).toBe('Timestamp');
		expect(rowHeader.find('.status').text()).toBe('Status');
		expect(rowHeader.find('.timeTaken').text()).toBe('Time Taken');
		expect(rowHeader.find('.planet').text()).toBe('Planet Name');

		// row failed data render properly
		const rowData = row.last();
		expect(rowData.find('.timestamp').text()).toBe(new Date().toLocaleDateString());
		expect(rowData.find('.status').text()).toBe('false');
		expect(rowData.find('.timeTaken').text()).toBe('0');
		expect(rowData.find('.planet').text()).toBe('');

		// only render failed row
		expect(row).toHaveLength(2);
	});
});
