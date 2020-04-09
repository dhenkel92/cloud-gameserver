import React, {CSSProperties} from "react";
import styles from './Button.module.css';
import colors from '../colors/Colors.module.css';

interface ButtonProps {
    name: string;
    style?: CSSProperties;
}

export class Button extends React.Component<ButtonProps, {}> {
    render() {
        return (
            <button style={this.props.style} className={`${styles.myButton} ${colors.primary}`}>{this.props.name}</button>
        )
    }
}
