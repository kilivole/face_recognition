import React from 'react';
import Tilty from 'react-tilty';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return(
        <div className='center ma4 mt0'>
            <Tilty className="Tilty shadow-5" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
            <div className="Tilty-inner"> <img style={{paddingTop: '5px'}} src={brain} alt='logo'/> </div>
            </Tilty>
        </div>
    );
}

export default Logo;
