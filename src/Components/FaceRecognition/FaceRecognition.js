import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {    
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img  id='inputimage' src={imageUrl} alt=""></img>   
                {
                    box.map((box, i) =>{
                        const {topRow, rightCol, bottomRow, leftCol} = box;
                        return(<div key={i} id="face" className='bounding-box' style={{top: topRow, right: rightCol, bottom: bottomRow, left: leftCol}}></div> );
                    })
                }        
            </div>
        </div>
    );
}

export default FaceRecognition;