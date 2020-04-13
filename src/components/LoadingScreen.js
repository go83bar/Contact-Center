import React from 'react'

export default function LoadingScreen() {
    return (
        <div className="loadingcontainer">
            <div className="spinner"></div>
            <div className="calculating">
                <h3>Initializing ...</h3>
            </div>
        </div>  
    )
}
