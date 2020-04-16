import React from 'react'

export default function LoadingScreen() {
    return (
        <div className="loadingcontainer">
            <div className="spinner"></div>
            <div className="calculating">
                <h3>Loading ...</h3>
            </div>
        </div>
    )
}
