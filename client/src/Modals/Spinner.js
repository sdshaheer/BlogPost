import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import FadeLoader from 'react-spinners/FadeLoader'
import ReactDom from 'react-dom';
import { useEffect } from 'react';

const Spinner = () => {
  const modalStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: '10px',
    zIndex: 1000,
  };

  const overStyles = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
  };

  return ReactDom.createPortal(
    <>
      <div style={overStyles}>
        <div style={modalStyles}>
          <FadeLoader />
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
};

export default Spinner;
