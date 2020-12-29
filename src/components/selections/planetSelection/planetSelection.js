import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { Autocomplete } from '@material-ui/lab';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { planetSlice } from '../../../store/planet/planetSlice';
import { vehicleSlice } from '../../../store/vehicle/vehicleSlice';
import styles from './planetSelection.module.scss';

const PlanetSelection = ({ planets, index }) => {
	// use state to allow free type
	const vehicles = useSelector((state) => state.vehicle.all);
	const selectedVehicle = useSelector((state) => state.vehicle.use[index]) || '';
	const currentPlanet = useSelector((state) => state.planet.use[index]) || '';
	const [planet, setPlanet] = useState(currentPlanet);
	const autoCompleteRef = useRef(null);
	const { vehicleUse } = vehicleSlice.actions;
	const { planetUse } = planetSlice.actions;
	const dispatch = useDispatch();

	const handleChange = (val) => {
		const selectedPlanet = planets.find((planet) => planet.name === val);
		
		// unselect invalid vehicle when the distance of the planet 
		// is larger than the max distance of the vehicle can travel
		if (selectedVehicle && selectedPlanet) {
			const vehicle = vehicles.find((vehicle) => vehicle.name === selectedVehicle);
			if (vehicle.max_distance < selectedPlanet.distance) {
				dispatch(vehicleUse({ index, vehicle: undefined }));
			}
		}

		// set change for both empty and valid selection
		if (planets.map((planet) => planet.name).includes(val) || (planets[index] && val === '')) {
			dispatch(planetUse({ index, planet: val }));
		}
		setPlanet(val);
	};

	//onChange inside textField to capture change in letters
	//onChange on Autocomplete to capture selection on dropdown
	return (
			<FormControl className={styles.planetSelection}>
				<Autocomplete
					options={planets}
					getOptionLabel={(planet) => planet.name}
					getOptionSelected={(planet, selected) => planet.name === selected.name}
					getOptionDisabled={(planet) => planet.disabled}
					renderInput={(params) => <TextField {...params} onChange={(e, planet) => handleChange(e.target.value)} label='Planet' variant='standard' inputRef={autoCompleteRef} value={planet} />}
					onChange={(e, planet) => handleChange(planet?.name || '')}
					inputValue={planet}
				/>
			</FormControl>
	);
};

export default PlanetSelection;
