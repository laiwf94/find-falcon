import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPlanets as getPlanetsFromApis } from '../../apis/planets';

const name = 'planet';

export const fetchPlanets = createAsyncThunk(`${name}/fetchPlanets`, async () => {
  return await getPlanetsFromApis();
})

export const planetSlice = createSlice({
	name: name,
	initialState: {
    all: [],
		available: [],
		use: [],
		status: 'idle'
	},
	reducers: {
		reset: (state) => {
			state.available = state.all;
			state.use = [];
    },
		planetUse: (state, action) => {
			const { payload } = action;
			const originalPlanet = state.use[payload.index];
			const mappedPlanets = state.all.map(planet => planet.name);
			const originalIndex = mappedPlanets.indexOf(originalPlanet);
			const newIndex = mappedPlanets.indexOf(payload.planet);
			if(newIndex > -1) state.available[newIndex].disabled = true;
			if(originalIndex > -1)  state.available[originalIndex].disabled = false;
			state.use[payload.index] = payload.planet;
		},
  },
  extraReducers: {
		[fetchPlanets.pending]: (state, action) => {
			state.status = 'pending';
		},
		// never hit because try catch handle failure
		// [fetchPlanets.rejected]: (state, action) => {
		// 	state.status = 'failed';
		// },
    [fetchPlanets.fulfilled]: (state, action) => {
      state.all = [...action.payload];
      state.available = [...action.payload];
			state.status = Array.isArray(action.payload) && action.payload.length > 0 ? 'success' : 'failed';
    },
  }
});

export default planetSlice.reducer;
