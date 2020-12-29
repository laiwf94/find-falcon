import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { vehicleSlice } from '../../../store/vehicle/vehicleSlice';
import RadioButton from '../../../ui/radioButton/radioButton';
import styles from './vehicleSelection.module.scss';

const VehicleSelection = ({ vehicles, index }) => {
	const usedVehicles = useSelector((state) => state.vehicle.use);
	const usedPlanets = useSelector((state) => state.planet.use);
	const planets = useSelector((state) => state.planet.all);
	const dispatch = useDispatch();
	const { vehicleUse } = vehicleSlice.actions;

	const handleChange = (vehicle) => {
		if (isDisabled(vehicle)) return;
		dispatch(vehicleUse({ index, vehicle: vehicle.name }));
	};

	const isDisabled = (vehicle) => {
		const isUsed = vehicle.total_no === 0 && usedVehicles[index] !== vehicle.name;
		const selectedPlanet = usedPlanets[index];
		if (!selectedPlanet) return isUsed;

		const planet = planets.find((planet) => planet.name === selectedPlanet);
		const isTooFar = vehicle.max_distance < planet.distance;
		return isUsed || isTooFar;
	};

	return (
		<fieldset className={styles.vehicleSelection}>
			{vehicles.map((vehicle) => {
				return (
						<RadioButton
							value={vehicle.name}
							label={`${vehicle.name} (${vehicle.total_no})`}
							key={vehicle.name}
							name={'vehicle'}
							disabled={isDisabled(vehicle)}
							onClick={() => handleChange(vehicle)}
							checked={usedVehicles[index] === vehicle.name}
						/>
				);
			})}
		</fieldset>
	);
};

export default VehicleSelection;
