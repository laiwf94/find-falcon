import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './history.module.scss';

const History = () => {
	let { status } = useParams();
	const getHistory = (state) => {
		if(status === 'false' || status === 'failed') {
			return state.history.filter(h => ['false', 'failed'].includes(h.status));
		} else if (status === 'success') {
			return state.history.filter(h => h.status === 'success');
		}
		return state.history;
	}
	const histories = useSelector((state) => getHistory(state));

	return (
		<div className={styles.history}>
			<div className={styles.row}>
				<div className={styles.timestamp}>Timestamp</div>
				<div className={styles.status}>Status</div>
				<div className={styles.timeTaken}>Time Taken</div>
				<div className={styles.planet}>Planet Name</div>
			</div>
			{histories.map((history, index) => {
				return (
					<div className={styles.row} key={history.timestamp + index}>
						<div className={styles.timestamp}>{history.timestamp}</div>
						<div className={styles.status}>{history.status}</div>
						<div className={styles.timeTaken}>{history.timeTaken}</div>
						<div className={styles.planet}>{history.planetName}</div>
					</div>
				);
			})}
		</div>
	);
};

export default History;
