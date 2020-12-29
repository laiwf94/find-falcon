import React, { createElement } from 'react';
import styles from './button.module.scss';
const Button = ({ component, children, disabled, ...props }) => {
	const color = props.color === 'secondary' ? styles.colorSecondary : styles.colorPrimary;

	const classNames = [color, styles.filled, props.className];
	if (disabled) classNames.push(styles.disabled);

	if (disabled) {
		return (
			<span {...props} className={classNames.join(' ')} aria-disabled='true'>
				{children}
			</span>
		);
	}
	if (component) {
		return createElement(component, { ...props, className: classNames.join(' ') }, children);
	}

	if (props.href) {
		return (
			<a {...props} className={classNames.join(' ')} role='button' aria-disabled='false'>
				{children}
			</a>
		);
	}

	return (
		<button {...props} className={classNames.join(' ')} aria-disabled='false'>
			{children}
		</button>
	);
};

export default Button;
