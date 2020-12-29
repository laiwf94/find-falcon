import expect from 'expect';
import fetchMock from 'fetch-mock';
import { fetchVehicles, vehicleSlice } from '../vehicle/vehicleSlice';
import { mockStore } from '../../utils/testUtil';

const mockVehicles = [
	{ name: 'Space pod', total_no: 2, max_distance: 200, speed: 2 },
	{ name: 'Space rocket', total_no: 1, max_distance: 300, speed: 4 },
	{ name: 'Space shuttle', total_no: 1, max_distance: 400, speed: 5 },
	{ name: 'Space ship', total_no: 2, max_distance: 600, speed: 10 },
];
describe('when vehicleSlice async thunks is invoked', () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it('invokes vehicle api when calling fetchVehicle successfully', () => {
		const body = [...mockVehicles];
		fetchMock.getOnce(process.env.REACT_APP_VEHICLE_URL, {
			body: body,
			headers: { 'content-type': 'application/json' },
		});
		return mockStore.dispatch(fetchVehicles()).then(() => {
			expect(mockStore.getState().vehicle.all).toEqual(body);
		});
	});

	it('invokes vehicle api when calling fetchVehicle failed', () => {
		fetchMock.getOnce(process.env.REACT_APP_VEHICLE_URL, {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});

		return mockStore.dispatch(fetchVehicles()).then(() => {
			expect(mockStore.getState().vehicle.all).toEqual([]);
			expect(mockStore.getState().vehicle.status).toEqual('failed');
		});
	});
});

describe('when vehicleSlice reducer is invoked', () => {
	const body = [...mockVehicles];

	beforeEach(() => {
		fetchMock.getOnce(process.env.REACT_APP_VEHICLE_URL, {
			body: body,
			headers: { 'content-type': 'application/json' },
		});

		mockStore.dispatch(fetchVehicles());
	});

	afterEach(() => {
		fetchMock.restore();
	});

	it('invokes vehicleUse action', () => {
		const addResult = mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 0, vehicle: 'Space pod' }));
		expect(addResult).toStrictEqual({
			type: 'vehicle/vehicleUse',
			payload: { index: 0, vehicle: 'Space pod' },
		});
		expect(mockStore.getState().vehicle.use[0]).toEqual('Space pod');
		const modifyResult = mockStore.dispatch(vehicleSlice.actions.vehicleUse({ index: 0, vehicle: 'Space rocket' }));
		expect(modifyResult).toStrictEqual({
			type: 'vehicle/vehicleUse',
			payload: { index: 0, vehicle: 'Space rocket' },
		});
		expect(mockStore.getState().vehicle.use[0]).toEqual('Space rocket');
	});

	it('invokes reset action', () => {
		const result = mockStore.dispatch(vehicleSlice.actions.reset());
		expect(result).toStrictEqual({
			type: 'vehicle/reset',
			payload: undefined,
		});
		expect(mockStore.getState().vehicle.use).toEqual([]);
		expect(mockStore.getState().vehicle.all).toEqual(body);
		expect(mockStore.getState().vehicle.available).toEqual(body);
	});
});
