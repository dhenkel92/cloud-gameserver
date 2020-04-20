import React, {CSSProperties} from "react";
import styles from './Button.module.css';
import colors from '../colors/Colors.module.css';

interface ButtonProps {
    name: string;
    style?: CSSProperties;
    className?: string;
}

export class Button extends React.Component<ButtonProps, {}> {
    render() {
        const classes = this.props.className ?? '';
        return (
            <button style={this.props.style} className={`${styles.myButton} ${colors.primary} ${classes}`}>{this.props.name}</button>
        )
    }
}
