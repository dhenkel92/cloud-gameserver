import React from "react";
import './GameConfigButtons.css';
import {Button} from "../../../general/button/Button";
import colors from "../../../general/colors/Colors.module.css";

export class GameConfigButtons extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Button name="Start" />
                <Button name="Stop" className={colors.error} />
            </div>
        )
    }
}
