import React from 'react';
import './Home.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import colors from '../general/colors/Colors.module.css';
import { GameConfigList } from './GameConfigList/GameConfigList';
import { GameConfigDetails } from './GameConfigDetails/GameConfigDetails';

export const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="navigation column">
        <Navigation redirectCallback={(path) => navigate(path)} />
      </div>
      <div className="homeRight column">
        <div className={`homeTopBar  ${colors.surface}`}>
          <span>Dashboard</span>
        </div>
        <div className="homeContent">
          <Routes>
            <Route path="/config/:id" element={<GameConfigDetails />} />
            <Route path="/" element={<GameConfigList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
