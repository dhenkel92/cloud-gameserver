import React, {CSSProperties} from "react";
import './Input.css';

interface InputProps {
    placeholder: string;
    type: string;
    style?: CSSProperties;
}

export class Input extends React.Component<InputProps, {}> {
    public static defaultProps = {
        type: "text",
    };

    render() {
        return (
            <input
                className="myInput"
                placeholder={this.props.placeholder}
                type={this.props.type}
            />
        );
    }
}
