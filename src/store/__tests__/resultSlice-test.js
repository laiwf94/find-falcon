import expect from 'expect';
import fetchMock from 'fetch-mock';
import { fetchResult, resultSlice } from '../result/resultSlice';
import { mockStore } from '../../utils/testUtil';

const mockResult = { planet_name: 'TEST_PLANET', status: 'success' };
const mockToken = { token: 'testtoken' };

describe('when resultSlice async thunks is invoked', () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it('invokes result api when calling fetchResult successfully', () => {
		const body = { ...mockResult };
		fetchMock.postOnce(process.env.REACT_APP_FIND_URL, {
			body: body,
			headers: { 'content-type': 'application/json' },
    });
    
    fetchMock.postOnce(process.env.REACT_APP_TOKEN_URL, {
			body: {...mockToken},
			headers: { 'content-type': 'application/json' },
		});

		return mockStore.dispatch(fetchResult({planets: [], vehicles: []})).then(() => {
			expect(mockStore.getState().result.planetName).toEqual(body.planet_name);
			expect(mockStore.getState().result.status).toEqual(body.status);
		});
	});

	it('invokes result api when calling fetchResult failed', () => {
		fetchMock.postOnce(process.env.REACT_APP_FIND_URL, {
			headers: { 'content-type': 'application/json' },
			status: 500,
			body: {},
    });
    
    fetchMock.postOnce(process.env.REACT_APP_TOKEN_URL, {
			body: {...mockToken},
			headers: { 'content-type': 'application/json' },
		});

		return mockStore.dispatch(fetchResult({planets: [], vehicles: []})).then(() => {
			expect(mockStore.getState().result.planetName).toEqual(undefined);
			expect(mockStore.getState().result.status).toEqual('failed');
		});
	});

	it('invokes setTimeTaken action', () => {
		const result = mockStore.dispatch(resultSlice.actions.setTimeTaken({ timeTaken: 200 }));
		expect(result).toStrictEqual({
			type: 'result/setTimeTaken',
			payload: { timeTaken: 200 },
		});
		expect(mockStore.getState().result.timeTaken).toEqual(200);
	});

	it('invokes reset action', () => {
		const result = mockStore.dispatch(resultSlice.actions.reset());
		expect(result).toStrictEqual({
			type: 'result/reset',
			payload: undefined,
		});
		expect(mockStore.getState().result.status).toEqual('idle');
		expect(mockStore.getState().result.planetName).toEqual('');
	});
});
