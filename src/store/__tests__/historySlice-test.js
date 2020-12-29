import expect from 'expect';
import { historySlice } from '../history/historySlice';
import { mockStore } from '../../utils/testUtil';

const mockHistory = { status: 'success', planetName: 'TEST_PLANET', timeTaken: 0, timestamp: new Date().toLocaleDateString() };
describe('when historySlice async thunks is invoked', () => {
	it('invokes addHistory action', () => {
		const result = mockStore.dispatch(historySlice.actions.addHistory({ ...mockHistory }));
		expect(result).toStrictEqual({
			type: 'history/addHistory',
			payload: mockHistory,
		});
		expect(mockStore.getState().history).toEqual([mockHistory]);
	});
});
