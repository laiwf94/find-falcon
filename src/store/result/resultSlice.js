import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken } from '../../apis/auth';
import { findFalcon } from '../../apis/result';

const name = 'result';

export const fetchResult = createAsyncThunk(`${name}/fetchResult`, async (payload) => {
	const tokenRes = await getToken();
	const falconRes = await findFalcon({
		token: tokenRes.token,
		planet_names: payload.planets,
		vehicle_names: payload.vehicles,
	});
	return falconRes;
});

export const resultSlice = createSlice({
	name: name,
	initialState: {
		planetName: '',
		status: 'idle',
		timeTaken: 0,
	},
	reducers: {
		reset: (state) => {
			state.status = 'idle';
			state.planetName = '';
			state.timeTaken = 0;
		},
		setTimeTaken: (state, action) => {
			state.timeTaken = action.payload.timeTaken;
		},
	},
	extraReducers: {
		[fetchResult.pending]: (state, action) => {
			state.status = 'pending';
		},
		// never hit because try catch handle failure
		// [fetchResult.rejected]: (state, action) => {
		// 	state.status = 'failed';
		// },
		[fetchResult.fulfilled]: (state, action) => {
			state.planetName = action.payload.planet_name;
			state.status = action.payload.status || 'failed';
		},
	},
});

export default resultSlice.reducer;
