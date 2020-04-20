import React, {DetailedHTMLProps, InputHTMLAttributes} from "react";
import colors from '../colors/Colors.module.css';
import inputStyle from './Input.module.css';

type InputProps = {} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export class Input extends React.Component<InputProps, {}> {
    render() {
        return (
            <input
                {...this.props}
                className={`${inputStyle.myInput} ${colors.background} ${colors.primaryFocus} ${this.props.className}`}
            />
        );
    }
}
