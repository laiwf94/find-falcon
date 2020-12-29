import { createSlice } from '@reduxjs/toolkit';

const name = 'history';

export const historySlice = createSlice({
	name: name,
	initialState: [],
	reducers: {
		addHistory: (state, action) => {
			const { payload } = action;
			const history = {
				status: payload.status,
				timeTaken: payload.timeTaken,
				planetName: payload.planetName,
				timestamp: new Date().toLocaleDateString(),
			};
			state.push(history);
		},
	},
});

export default historySlice.reducer;
