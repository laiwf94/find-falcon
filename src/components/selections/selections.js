import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PlanetSelection from './planetSelection/planetSelection';
import styles from './selections.module.scss';
import VehicleSelection from './vehicleSelection/vehicleSelection';

const Selections = () => {
	const [planets, setPlanets] = useState([]);
	const [vehicles, setVehicles] = useState([]);
	const planetStatus = useSelector((state) => state.planet.status);
	const vehicleStatus = useSelector((state) => state.vehicle.status);
	const availablePlanets = useSelector((state) => state.planet.available);
	const availableVehicles = useSelector((state) => state.vehicle.available);

	// set state when data ready
	useEffect(() => {
		if (planetStatus === 'success' && vehicleStatus === 'success') {
			setPlanets([...availablePlanets]);
			setVehicles([...availableVehicles]);
		}
	}, [availablePlanets, availableVehicles, planetStatus, vehicleStatus]);

	const Selection = useCallback(
		({ index }) => {
			return (
				<div className={styles.selection}>
					<PlanetSelection planets={planets} index={index} />
					<VehicleSelection vehicles={vehicles} index={index} />
				</div>
			);
		},
		[planets, vehicles],
	);
	
	// hardcoded 4 times loop
	return (
		<div className={styles.selections}>
			{[0, 1, 2, 3].map((val) => {
				return <Selection key={val} index={val} />;
			})}
		</div>
	);
};

export default Selections;
