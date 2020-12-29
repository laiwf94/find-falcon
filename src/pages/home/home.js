import React from 'react';
import Button from '../../ui/button/button';
import { Link } from 'react-router-dom';
import styles from './home.module.scss';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PublicIcon from '@material-ui/icons/Public';

const Home = () => {
	return (
		<div className={styles.homeBtn}>
			<Button component={Link} to={'/form'} color='primary'>
				<ListAltIcon />
				Form
			</Button>
			<Button href={'https://github.com/laiwf94/find-falcon'} color='primary'>
				<PublicIcon />
				Github
			</Button>
		</div>
	);
};

export default Home;
