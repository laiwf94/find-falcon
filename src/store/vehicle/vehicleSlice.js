import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getVehicles as getVehiclesFromApis } from '../../apis/vehicles';

const name = 'vehicle';

export const fetchVehicles = createAsyncThunk(`${name}/fetchVehicles`, async () => {
	return await getVehiclesFromApis();
});

export const vehicleSlice = createSlice({
	name: name,
	initialState: {
		all: [],
		available: [],
		use: [],
		status: 'idle',
	},
	reducers: {
		reset: (state) => {
			state.available = state.all;
			state.use = [];
		},
		vehicleUse: (state, action) => {
			const { payload } = action;
			const mappedVehicles = state.all.map((vehicle) => vehicle.name);
			const originalVehicle = state.use[payload.index];
			const originalIndex = mappedVehicles.indexOf(originalVehicle);
			const newIndex = mappedVehicles.indexOf(payload.vehicle);
			if (newIndex > -1) state.available[newIndex].total_no--;
			if (originalIndex > -1) state.available[originalIndex].total_no++;
			state.use[payload.index] = payload.vehicle;
		},
	},
	extraReducers: {
		[fetchVehicles.pending]: (state, action) => {
			state.status = 'pending';
		},
		// never hit because try catch handle failure
		// [fetchVehicles.rejected]: (state, action) => {
		// 	state.status = 'failed';
		// },
		[fetchVehicles.fulfilled]: (state, action) => {
			state.all = [...action.payload];
			state.available = [...action.payload];
			state.status = Array.isArray(action.payload) && action.payload.length > 0 ? 'success' : 'failed';
		},
	},
});

export default vehicleSlice.reducer;
