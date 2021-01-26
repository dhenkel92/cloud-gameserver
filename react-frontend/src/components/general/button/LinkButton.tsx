import React from 'react';
import styles from './Button.module.css';
import colors from '../colors/Colors.module.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

type LinkButtonProps = {
  name: string;
  to: string;
  className?: string;
};

type SpecializedLinkButtonProps = {
  name: string;
  to: string;
  className?: string;
};

export class LinkButton extends React.Component<LinkButtonProps> {
  render(): JSX.Element {
    return (
      <Link {...this.props} className={`${styles.btn} ${this.props.className}`}>
        {this.props.name}
      </Link>
    );
  }
}

export class SuccessLinkButton extends React.Component<SpecializedLinkButtonProps> {
  render(): JSX.Element {
    return <LinkButton {...this.props} className={`${styles.success} ${this.props.className}`} />;
  }
}

export class ErrorLinkButton extends React.Component<SpecializedLinkButtonProps> {
  render(): JSX.Element {
    return <LinkButton {...this.props} className={`${styles.danger} ${this.props.className}`} />;
  }
}

export class PrimaryLinkButton extends React.Component<SpecializedLinkButtonProps> {
  render(): JSX.Element {
    return <LinkButton {...this.props} className={`${colors.primary} ${this.props.className}`} />;
  }
}
