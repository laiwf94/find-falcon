import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { planetSlice } from '../../store/planet/planetSlice';
import { resultSlice } from '../../store/result/resultSlice';
import { vehicleSlice } from '../../store/vehicle/vehicleSlice';
import styles from './result.module.scss';
import { historySlice } from '../../store/history/historySlice';
import Button from '../../ui/button/button';

const Result = () => {
	const result = useSelector((state) => state.result);
	const { reset: resultReset } = resultSlice.actions;
	const { reset: planetReset } = planetSlice.actions;
	const { reset: vehicleReset } = vehicleSlice.actions;
	const { addHistory } = historySlice.actions;
	const history = useHistory();
	const dispatch = useDispatch();

	// reset state on find again
	const reset = () => {
		dispatch(resultReset());
		dispatch(planetReset());
		dispatch(vehicleReset());
	};

	useEffect(() => {
    if (result.status === 'idle') {
      // redirect if direct access, forward or backward button
			history.push('/');
		} else if (!['idle', 'pending'].includes(result.status)) {
      // add history if status is failed, success or false
      dispatch(addHistory({
        timeTaken: result.timeTaken,
        planetName: result.planetName,
        status: result.status
      }));
    }
	}, [addHistory, dispatch, history, result.planetName, result.status, result.timeTaken]);

	return (
		<div className={styles.result}>
      <h1>Find Falcon</h1>
			{result.status === 'success' && (
				<div className={styles.success}>
					<h2>SUCCESS! CONGRATULATION ON FINDING FALCON. KING SHAH IS MIGHTY PLEASED.</h2>
					<h2>TIME TAKEN: {result.timeTaken}</h2>
					<h2>PLANET FOUND: {result.planetName}</h2>
				</div>
			)}
			{result.status === 'false' && <h2 className={styles.failed}>BAD LUCK!!!, KING SHAN IS UNHAPPY WITH THIS NEWS. TRY AGAIN TO FIND FALCON!!</h2>}
			{result.status === 'pending' && <h2>Loading...</h2>}
			{result.status === 'failed' && <h2 className={styles.failed}>Oops! Something went wrong. Please try again later...</h2>}
			<Button component={Link} to={'/'} onClick={() => reset()} color='primary' className={styles.findAgainBtn}>
				Find Again
			</Button>
		</div>
	);
};

export default Result;
