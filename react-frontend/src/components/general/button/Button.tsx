import React from 'react';
import styles from './Button.module.css';
import colors from '../colors/Colors.module.css';

type ButtonProps = {
  name: string;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export class Button extends React.Component<ButtonProps> {
  render(): JSX.Element {
    return (
      <button {...this.props} className={`${styles.myButton} ${colors.primary} ${this.props.className}`}>
        {this.props.name}
      </button>
    );
  }
}
