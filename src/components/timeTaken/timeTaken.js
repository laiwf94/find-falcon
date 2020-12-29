import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './timeTaken.module.scss';
import { resultSlice } from '../../store/result/resultSlice';

const TimeTaken = () => {
	const planets = useSelector((state) => state.planet);
	const vehicles = useSelector((state) => state.vehicle);
	const timeTaken = useSelector((state) => state.result.timeTaken);
	const dispatch = useDispatch();
	const { setTimeTaken } = resultSlice.actions;

	useEffect(() => {
		const planetNames = planets.all.map((planet) => planet.name);
		const vehicleNames = vehicles.all.map((planet) => planet.name);
		let timeTaken = 0;
		for (let i = 0; i < 4; i++) {
			const planetIndex = planetNames.indexOf(planets.use[i]);
			const vehicleIndex = vehicleNames.indexOf(vehicles.use[i]);
			if (planetIndex > -1 && vehicleIndex > -1) {
				const planet = planets.all[planetIndex];
				const vehicle = vehicles.all[vehicleIndex];
				// handle possible floating issue in JS
				timeTaken += Math.floor(planet.distance / vehicle.speed);
			}
			dispatch(setTimeTaken({ timeTaken }));
		}
	}, [dispatch, planets.all, planets.use, setTimeTaken, vehicles.all, vehicles.use]);

	return (
			<h3 className={styles.timeTaken}>Time Taken: {timeTaken}</h3>
	);
};

export default TimeTaken;
