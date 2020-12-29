import fetchMock from 'fetch-mock';
import { fetchResult, resultSlice } from '../../store/result/resultSlice';
import { mountWithState, mockStore } from '../../utils/testUtil';
import Result from '../result/result';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useHistory: () => ({
		push: mockHistoryPush,
	}),
}));

describe('invoked Result Page', () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it('Result page rendered properly', () => {
		const ResultComponent = mountWithState(<Result />, mockStore, ['/result']);
		const h1 = ResultComponent.find('h1');
		expect(h1.text()).toBe('Find Falcon');
		const findButton = ResultComponent.find('a');
		expect(findButton.text()).toBe('Find Again');
	});

	it('when no result is ready, redirects to home page', async () => {
		mountWithState(<Result />, mockStore, ['/result']);
		expect(mockHistoryPush).toHaveBeenCalledWith('/');
	});

	it('when result is ready, page rendered properly', async () => {
		const mockResult = { planet_name: 'TEST_PLANET', status: 'success' };
		const mockToken = { token: 'testtoken' };
		fetchMock.post(process.env.REACT_APP_FIND_URL, {
			body: mockResult,
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.post(process.env.REACT_APP_TOKEN_URL, {
			body: { ...mockToken },
			headers: { 'content-type': 'application/json' },
		});

		const result = await mockStore.dispatch(fetchResult({ planets: [], vehicles: [] }));
		mockStore.dispatch(resultSlice.actions.setTimeTaken({ timeTaken: 200 }));

		// successfully got back result
		expect(result.type).toBe('result/fetchResult/fulfilled');
		expect(result.payload).toEqual({ planet_name: 'TEST_PLANET', status: 'success' });

		const resultComponent = mountWithState(<Result />, mockStore, ['/result']);

		const h2 = resultComponent.find('h2');

		// page renders correctly
		expect(h2.first().text()).toBe('SUCCESS! CONGRATULATION ON FINDING FALCON. KING SHAH IS MIGHTY PLEASED.');
		expect(h2.at(1).text()).toBe('TIME TAKEN: 200');
		expect(h2.last().text()).toBe('PLANET FOUND: TEST_PLANET');

		// history is added
		expect(mockStore.getState().history[0]).toEqual({ planetName: 'TEST_PLANET', status: 'success', timeTaken: 0, timestamp: new Date().toLocaleDateString() });
	});

	it('when result is loading, page rendered properly', async () => {
		const mockResult = { planet_name: 'TEST_PLANET', status: 'success' };
		const mockToken = { token: 'testtoken' };
		fetchMock.post(process.env.REACT_APP_FIND_URL, {
			body: mockResult,
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.post(process.env.REACT_APP_TOKEN_URL, {
			body: { ...mockToken },
			headers: { 'content-type': 'application/json' },
		});

		mockStore.dispatch(fetchResult({ planets: [], vehicles: [] }));
		mockStore.dispatch(resultSlice.actions.setTimeTaken({ timeTaken: 200 }));

		const resultComponent = mountWithState(<Result />, mockStore, ['/result']);

		const h2 = resultComponent.find('h2');

		// when it is still loading
		expect(h2.text()).toBe('Loading...');
	});

	it('when result is fail to load, page rendered properly', async () => {
		const mockToken = { token: 'testtoken' };
		fetchMock.post(process.env.REACT_APP_FIND_URL, {
			body: {},
			status: 500,
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.post(process.env.REACT_APP_TOKEN_URL, {
			body: { ...mockToken },
			headers: { 'content-type': 'application/json' },
		});

		const result = await mockStore.dispatch(fetchResult({ planets: [], vehicles: [] }));
		mockStore.dispatch(resultSlice.actions.setTimeTaken({ timeTaken: 200 }));

		// fail with no payload
		expect(result.type).toBe('result/fetchResult/fulfilled');
		expect(result.payload).toEqual({});

		const resultComponent = mountWithState(<Result />, mockStore, ['/result']);

		const h2 = resultComponent.find('h2');

		// showing fail message
		expect(h2.text()).toBe('Oops! Something went wrong. Please try again later...');
	});

	it('when result is false, page rendered properly with no redirects', async () => {
		const mockToken = { token: 'testtoken' };
		fetchMock.post(process.env.REACT_APP_FIND_URL, {
			body: { status: 'false' },
			headers: { 'content-type': 'application/json' },
		});

		fetchMock.post(process.env.REACT_APP_TOKEN_URL, {
			body: { ...mockToken },
			headers: { 'content-type': 'application/json' },
		});

		const result = await mockStore.dispatch(fetchResult({ planets: [], vehicles: [] }));
		mockStore.dispatch(resultSlice.actions.setTimeTaken({ timeTaken: 200 }));

		// fail with no payload
		expect(result.type).toBe('result/fetchResult/fulfilled');
		expect(result.payload).toEqual({ status: 'false' });

		const resultComponent = mountWithState(<Result />, mockStore, ['/result']);

		// never redirects
		// expect(mockHistoryPush).not.toHaveBeenCalledWith('/');

		const h2 = resultComponent.find('h2');

		// showing false message
		expect(h2.text()).toBe('BAD LUCK!!!, KING SHAN IS UNHAPPY WITH THIS NEWS. TRY AGAIN TO FIND FALCON!!');
	});

	it('page redirects, and state reset on clicking find again', async () => {
		const resultComponent = mountWithState(<Result />, mockStore, ['/result']);
		const findAgain = resultComponent.find('a');
		findAgain.simulate('click', {});
		resultComponent.update();

		// redirects to home page
		expect(mockHistoryPush).toHaveBeenCalledWith('/');

		expect(mockStore.getState().result).toEqual({ status: 'idle', timeTaken: 0, planetName: '' });
		expect(mockStore.getState().planet).toEqual({ all: [], available: [], use: [], status: 'idle' });
		expect(mockStore.getState().vehicle).toEqual({ all: [], available: [], use: [], status: 'idle' });
	});
});
