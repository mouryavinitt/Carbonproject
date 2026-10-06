import React from 'react';

function StatCards({ totalCo2, rating, electricityCo2, travelCo2 }) {
    const getBadgeColor = (rate) => {
        if (rate === 'Low') return 'bg-success text-white';
        if (rate === 'Moderate') return 'bg-warning text-dark';
        return 'bg-danger text-white';
    };

    return (
        <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-md-3">
                <div className="p-3 bg-white border-0 rounded-4 shadow-sm text-center">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Daily CO₂</span>
                    <h3 className="fw-bold text-dark mb-0">{totalCo2.toFixed(2)} <small className="fs-6 text-muted">kg</small></h3>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
                <div className="p-3 bg-white border-0 rounded-4 shadow-sm text-center">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Emission Level</span>
                    <span className={`badge ${getBadgeColor(rating)} fs-6 px-3 py-2 rounded-pill mt-1`}>
                        {rating} Impact
                    </span>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
                <div className="p-3 bg-white border-0 rounded-4 shadow-sm text-center">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Services Footprint</span>
                    <h3 className="fw-bold text-primary mb-0">{electricityCo2.toFixed(2)} <small className="fs-6 text-muted">kg</small></h3>
                </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
                <div className="p-3 bg-white border-0 rounded-4 shadow-sm text-center">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1">Travel Footprint</span>
                    <h3 className="fw-bold text-success mb-0">{travelCo2.toFixed(2)} <small className="fs-6 text-muted">kg</small></h3>
                </div>
            </div>
        </div>
    );
}

export default StatCards;