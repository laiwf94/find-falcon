import expect from 'expect';
import fetchMock from 'fetch-mock';
import { fetchPlanets, planetSlice } from '../planet/planetSlice';
import { mockStore } from '../../utils/testUtil';

const mockPlanets = [
	{ name: 'Donlon', distance: 100 },
	{ name: 'Enchai', distance: 200 },
	{ name: 'Jebing', distance: 300 },
	{ name: 'Sapir', distance: 400 },
	{ name: 'Lerbin', distance: 500 },
	{ name: 'Pingasor', distance: 600 },
];
describe('when planetSlice async thunks is invoked', () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it('invokes planet api when calling fetchPlanet successfully', () => {
		const body = [...mockPlanets];
		fetchMock.get(process.env.REACT_APP_PLANET_URL, {
			body: body,
			headers: { 'content-type': 'application/json' },
		});

		return mockStore.dispatch(fetchPlanets()).then(() => {
			expect(mockStore.getState().planet.all).toEqual(body);
		});
	});

	it('invokes planet api when calling fetchPlanet failed', () => {
		fetchMock.getOnce(process.env.REACT_APP_PLANET_URL, {
			headers: { 'content-type': 'application/json' },
			status: 500,
			body: [],
		});

		return mockStore.dispatch(fetchPlanets()).then(() => {
			expect(mockStore.getState().planet.all).toEqual([]);
			expect(mockStore.getState().planet.status).toEqual('failed');
		});
	});
});

describe('when planetSlice reducer is invoked', () => {
	const body = [...mockPlanets];

	beforeEach(() => {
		fetchMock.getOnce(process.env.REACT_APP_PLANET_URL, {
			body: body,
			headers: { 'content-type': 'application/json' },
		});
		mockStore.dispatch(fetchPlanets());
	})
	afterEach(() => {
		fetchMock.restore();
	});

	it('invokes planetUse action', () => {
		const addResult = mockStore.dispatch(planetSlice.actions.planetUse({ index: 0, planet: 'Pingasor' }));
		expect(addResult).toStrictEqual({
			type: 'planet/planetUse',
			payload: { index: 0, planet: 'Pingasor' },
		});
		expect(mockStore.getState().planet.use[0]).toEqual('Pingasor');
		const modifyResult = mockStore.dispatch(planetSlice.actions.planetUse({ index: 0, planet: 'Lerbin' }));
		expect(modifyResult).toStrictEqual({
			type: 'planet/planetUse',
			payload: { index: 0, planet: 'Lerbin' },
		});
		expect(mockStore.getState().planet.use[0]).toEqual('Lerbin');
	});

	it('invokes reset action', () => {
		const result = mockStore.dispatch(planetSlice.actions.reset());
		expect(result).toStrictEqual({
			type: 'planet/reset',
			payload: undefined,
		});
		expect(mockStore.getState().planet.use).toEqual([]);
		expect(mockStore.getState().planet.all).toEqual(body);
		expect(mockStore.getState().planet.available).toEqual(body);
	});
})
