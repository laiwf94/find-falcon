import React from 'react';
import styles from './radioButton.module.scss';

const RadioButton = ({ value, label, disabled, checked, onChange, name, ...props }) => {
	const color = props.color === 'secondary' ? styles.colorSecondary : styles.colorPrimary;

	const commonClassName = [color];
	if (checked) commonClassName.push(styles.checked);
	if (disabled) commonClassName.push(styles.disabled);

	const iconlabelClassName = [...commonClassName];
	iconlabelClassName.push(styles.radioIconLabel);

	const labelClassName = [...commonClassName];
	labelClassName.push(styles.radioLabel);

	return (
		<label {...props} className={[styles.radio, props.className].join(' ')}>
			<span className={styles.radioWrapper} aria-disabled={disabled}>
				<span className={iconlabelClassName.join(' ')}>
					<input className={styles.radioInput} name={name} type='radio' value={value} checked={checked} readOnly disabled={disabled} />
					<div className={styles.radioIcon}>
						<svg className={styles.radioRing} focusable='false' viewBox='0 0 24 24' aria-hidden='true'>
							<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'></path>
						</svg>
						<svg className={styles.radioDot} focusable='false' viewBox='0 0 24 24' aria-hidden='true'>
							<path d='M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z'></path>
						</svg>
					</div>
				</span>
			</span>
			<span className={labelClassName.join(' ')}>{label}</span>
		</label>
	);
};

export default RadioButton;
