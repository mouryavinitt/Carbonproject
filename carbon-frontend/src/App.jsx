import React, { useState } from 'react';
import StatCards from './components/StatCards';
import CarbonForm from './components/CarbonForm';
import { postCalculateFootprint } from './services/apiService';

function App() {
    const [result, setResult] = useState({
        totalCo2: 0,
        rating: 'Low',
        electricityCo2: 0,
        travelCo2: 0
    });

    const [msg, setMsg] = useState('');

    const handleCalculate = async (formData) => {
        try {
            const response = await postCalculateFootprint(formData);
            setResult({
                totalCo2: response.data.totalDailyEmissionKg,
                rating: response.data.rating,
                electricityCo2: response.data.dailyServiceEmissionKg,
                travelCo2: response.data.dailyTravelEmissionKg
            });
            setMsg('Calculated via Java REST API backend!');
        } catch (err) {
            const elecCo2 = (parseFloat(formData.electricity) || 0) * 0.82;
            const gasCo2 = (parseFloat(formData.gas) || 0) * 2.98;
            const waterCo2 = (parseFloat(formData.water) || 0) * 0.001;
            const wastewaterCo2 = (parseFloat(formData.wastewater) || 0) * 0.002;

            const serviceTotal = elecCo2 + gasCo2 + waterCo2 + wastewaterCo2;

            const walkCo2 = 0;
            const evCo2 = (parseFloat(formData.evBike) || 0) * 0.02;
            const carCo2 = (parseFloat(formData.car) || 0) * 0.21;
            const busCo2 = (parseFloat(formData.bus) || 0) * 0.08;
            const trainCo2 = (parseFloat(formData.trainMetro) || 0) * 0.04;
            const flightCo2 = (parseFloat(formData.flight) || 0) * 0.25;
            const boatCo2 = (parseFloat(formData.boat) || 0) * 0.18;

            const travelTotal = walkCo2 + evCo2 + carCo2 + busCo2 + trainCo2 + flightCo2 + boatCo2;
            const total = serviceTotal + travelTotal;

            let ratingScore = total <= 5 ? 'Low' : total <= 15 ? 'Moderate' : 'High';

            setResult({
                totalCo2: total,
                rating: ratingScore,
                electricityCo2: serviceTotal,
                travelCo2: travelTotal
            });
            setMsg(`Calculated for ${formData.userName || 'Guest'} (Local React Mode)`);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Header Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold fs-4" href="#">🌱 CarbonTrack</a>
                    
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-white py-5 border-bottom shadow-sm">
                <div className="container text-center">
                    <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-semibold mb-2">
                        Eco-Tracker & Footprint Analytics
                    </span>
                    <h1 className="fw-bold display-5 text-dark">Track Your Daily Carbon Impact</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '650px' }}>
                        Calculate daily greenhouse gas emissions generated across utility usage and personal mobility to maintain a sustainable lifestyle.
                    </p>
                </div>
            </header>

            {/* Main Application Area */}
            <main className="container my-5 flex-grow-1">
                {msg && <div className="alert alert-success rounded-3 shadow-sm py-2 mb-4 text-center">{msg}</div>}

                <StatCards 
                    totalCo2={result.totalCo2} 
                    rating={result.rating} 
                    electricityCo2={result.electricityCo2} 
                    travelCo2={result.travelCo2} 
                />

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <CarbonForm handleCalculate={handleCalculate} />
                    </div>
                </div>

                {/* Feature Cards Section */}
                <section className="mt-5 pt-4 border-top">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold">How CarbonTrack Works</h4>
                    </div>
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                <div className="fs-1 mb-2">⚡</div>
                                <h6 className="fw-bold">Utilities Tracking</h6>
                                <p className="text-muted small">Logs daily electricity, cooking gas, water, and wastewater metrics.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                <div className="fs-1 mb-2">🚗</div>
                                <h6 className="fw-bold">Mobility Calculations</h6>
                                <p className="text-muted small">Factors in emissions from flights, trains, cars, buses, and zero-emission transit.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                <div className="fs-1 mb-2">📊</div>
                                <h6 className="fw-bold">Real-time Analytics</h6>
                                <p className="text-muted small">Processes data via REST API endpoints or local client-side fallbacks.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-4 bg-dark text-center text-white-50 mt-auto small">
                © Only for environmental awareness and educational purposes. All rights reserved.
            </footer>
        </div>
    );
}

export default App;