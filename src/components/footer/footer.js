import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ErrorIcon from '@material-ui/icons/Error';
import RestoreIcon from '@material-ui/icons/Restore';
import React, { useState, useEffect } from 'react';
import styles from './footer.module.scss';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
	const [value, setValue] = useState(-1);
  const location = useLocation();

  // remove highlight when navigate out from history page
  useEffect(() => {
    if(!location.pathname.startsWith('/history')) {
      setValue(-1);
    }
  }, [location.pathname])

	return (
		<BottomNavigation
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			showLabels
			className={styles.footer}
		>
			<BottomNavigationAction label='Recents' icon={<RestoreIcon />} component={Link} to={'/history'} />
			<BottomNavigationAction label='Success' icon={<FavoriteIcon />} component={Link} to={'/history/success'} />
			<BottomNavigationAction label='Failed' icon={<ErrorIcon />} component={Link} to={'/history/false'} />
		</BottomNavigation>
	);
};

export default Footer;
