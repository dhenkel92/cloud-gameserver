import React, {CSSProperties} from "react";
import './Button.css';

interface ButtonProps {
    name: string;
    style?: CSSProperties;
}

export class Button extends React.Component<ButtonProps, {}> {
    render() {
        return (
            <button style={this.props.style} className="myButton">{this.props.name}</button>
        )
    }
}
