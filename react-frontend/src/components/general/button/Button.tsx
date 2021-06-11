import React from 'react';
import colors from '../colors/Colors.module.css';
import styles from './Button.module.css';

type ButtonProps = {
  name: string;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type SpecializedButton = {
  name: string;
  onClick?: (e: MouseEvent) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export class Button extends React.Component<ButtonProps> {
  render(): JSX.Element {
    return (
      <button {...this.props} className={`${styles.btn} ${this.props.className}`}>
        {this.props.name}
      </button>
    );
  }
}

export class SuccessButton extends React.Component<SpecializedButton> {
  render(): JSX.Element {
    return <Button {...this.props} className={`${styles.success} ${this.props.className}`} />;
  }
}

export class ErrorButton extends React.Component<SpecializedButton> {
  render(): JSX.Element {
    return <Button {...this.props} className={`${styles.danger} ${this.props.className}`} />;
  }
}

export class PrimaryButton extends React.Component<SpecializedButton> {
  render(): JSX.Element {
    return <Button {...this.props} className={`${colors.primaryBtn} ${this.props.className}`} />;
  }
}
