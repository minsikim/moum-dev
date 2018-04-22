import React from 'react';



const tabWrapper = (props) => {
    const style= {
        width: 'auto',
        backgroundColor: '#111'
    }
    return (
        <div>
            <div className="etabs-tabgroup">
                <div className="etabs-tabs"></div>
                <div className="etabs-buttons"></div>
            </div>
            <div className="etabs-views"></div>
        </div>
    );
}

export default tabWrapper;