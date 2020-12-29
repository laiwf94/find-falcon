import { AppBar, Toolbar } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { planetSlice } from '../../store/planet/planetSlice';
import { vehicleSlice } from '../../store/vehicle/vehicleSlice';
import styles from './header.module.scss';
import Button from '../../ui/button/button';

const Header = () => {
	const { reset: vehicleReset } = vehicleSlice.actions;
	const { reset: planetReset } = planetSlice.actions;
	const location = useLocation();
	const dispatch = useDispatch();

	const reset = () => {
		dispatch(planetReset());
		dispatch(vehicleReset());
	};

	return (
		<AppBar position='fixed'>
			<Toolbar>
				<strong>FIND FALCON</strong>
				<div className={styles.btnGroup}>
					{location.pathname === '/form' && (
						<Button color='secondary' onClick={() => reset()} className={styles.resetBtn}>
							Reset
						</Button>
					)}
					{location.pathname !== '/' && (
						<Button color='secondary' component={Link} to={'/'} className={styles.homeBtn}>
							Home
						</Button>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};
export default Header;
