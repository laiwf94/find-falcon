import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import ErrorDialog from './components/errorDialog/errorDialog';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Form from './pages/form/form';
import Home from './pages/home/home';
import Result from './pages/result/result';
import { fetchPlanets } from './store/planet/planetSlice';
import { fetchVehicles } from './store/vehicle/vehicleSlice';
import History from './pages/history/history';

function App() {
	const planetStatus = useSelector((state) => state.planet.status);
	const vehicleStatus = useSelector((state) => state.vehicle.status);
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchPlanets());
		dispatch(fetchVehicles());
	}, [dispatch]);

	// open error dialog box when hitting error on planet or vehicle api error
	useEffect(() => {
		if (planetStatus === 'failed' || vehicleStatus === 'failed') {
			setOpen(true);
		}
	}, [planetStatus, vehicleStatus]);

	return (
		<>
			<ErrorDialog open={open} />
			<Header />
			<Switch>
				<Route exact path={['/history','/history/:status']}>
					<History />
				</Route>
				<Route path='/result'>
					<Result />
				</Route>
				<Route exact path='/form'>
					<Form />
				</Route>
				<Route exact path='/'>
					<Home />
				</Route>
			</Switch>
			<Footer />
		</>
	);
}

export default App;
