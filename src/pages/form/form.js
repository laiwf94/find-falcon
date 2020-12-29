import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeTaken from '../../components/timeTaken/timeTaken';
import Selections from '../../components/selections/selections';
import { planetSlice } from '../../store/planet/planetSlice';
import { fetchResult, resultSlice } from '../../store/result/resultSlice';
import styles from './form.module.scss';
import { vehicleSlice } from '../../store/vehicle/vehicleSlice';
import Button from '../../ui/button/button'

const Form = () => {
	const [disabled, setDisabled] = useState(true);
	const { reset: resultReset } = resultSlice.actions;
	const { reset: planetReset } = planetSlice.actions;
	const { reset: vehicleReset } = vehicleSlice.actions;
	const usedPlanets = useSelector((state) => state.planet.use);
	const usedVehicles = useSelector((state) => state.vehicle.use);
	const dispatch = useDispatch();

	// reset state when visit the page directly - url , forward, back button
	useEffect(() => {
		dispatch(resultReset());
		dispatch(planetReset());
		dispatch(vehicleReset());
	}, [dispatch, planetReset, resultReset, vehicleReset]);

	// disable/enable find button
	useEffect(() => {
		const isButtonDisabled = () => {
			if (usedPlanets.filter((planet) => planet).length < 4) return true;
			if (usedVehicles.filter((vehicle) => vehicle).length < 4) return true;
			return false;
		};
		setDisabled(isButtonDisabled());
	}, [usedPlanets, usedVehicles]);

	return (
		<form className={styles.form}>
			<h1 className={styles.title}>SELECT PLANETS AND VECHILES TO FIND FALCON</h1>
			<div className={styles.layout}>
				<Selections />
				<TimeTaken />
			</div>
			<Button component={Link} to={'/result'} color='secondary' className={styles.findFalcon} onClick={() => dispatch(fetchResult({ vehicles: usedVehicles, planets: usedPlanets }))} disabled={disabled}>
				Find Falcon
			</Button>
		</form>
	);
};

export default Form;
