import React from 'react';
import './Loading.css';
import LoadingGIF from '../../assets/img/loading.gif';

const Loading = props => {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <img className="loading-gif" src={LoadingGIF} alt="Loading Logo" />
        <p className="loading-title">{props.title}</p>
      </div>
    </div>
  );
};

export default Loading;