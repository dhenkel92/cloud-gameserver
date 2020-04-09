import './GameConfigEntryEmpty.css';
import React from "react";
import colors from '../../general/colors/Colors.module.css';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from '@fortawesome/free-solid-svg-icons';

export class GameConfigEntryEmpty extends React.Component<{}, {}> {
    render() {
        return (
            <div className={`configEntryWrapper ${colors.surface02} ${colors.primaryHover}`}>
                <Link to="/">
                    <div className="createNewGameConfig">
                        <FontAwesomeIcon icon={faPlus} size="3x" className={colors.primaryColor}/>
                    </div>
                </Link>
            </div>
        );
    }
}
