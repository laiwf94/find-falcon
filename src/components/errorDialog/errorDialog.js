import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';

const ErrorDialog = ({open}) => {

	return (
		<Dialog open={open} aria-labelledby='error modalbox' aria-describedby='modalbox for error'>
			<DialogTitle>Unexpected Error</DialogTitle>
			<DialogContent>Oops! Something went wrong. Please try again later...</DialogContent>
			<DialogActions>
				<Button onClick={() => window.location.reload()} color='primary'>
					Refresh
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ErrorDialog;