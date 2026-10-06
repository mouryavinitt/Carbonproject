import React, { useState } from 'react';

function CarbonForm({ handleCalculate }) {
    const [formData, setFormData] = useState({
        userName: '',
        // Services & Utilities
        electricity: 0,
        gas: 0,
        water: 0,
        wastewater: 0,
        // Travel & Mobility
        walking: 0,
        evBike: 0,
        car: 0,
        bus: 0,
        trainMetro: 0,
        flight: 0,
        boat: 0
    });

    const [busy, setBusy] = useState(false);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await handleCalculate(formData);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-white rounded p-4 shadow-sm border mb-4">
            <h5 className="fw-bold mb-3">Enter Daily Activities</h5>
            <form onSubmit={onFormSubmit}>
                <div className="mb-3">
                    <label className="form-label small text-muted fw-bold">User Name</label>
                    <input 
                        type="text" 
                        name="userName" 
                        className="form-control form-control-sm" 
                        value={formData.userName} 
                        onChange={onInputChange} 
                        placeholder="Enter your name" 
                        required 
                    />
                </div>

                {/* --- SECTION 1: SERVICES & UTILITIES --- */}
                <div className="p-3 bg-light rounded mb-3 border">
                    <h6 className="text-primary fw-bold mb-3">⚡ Services & Utilities</h6>
                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <label className="form-label small text-muted">Electricity (kWh)</label>
                            <input type="number" name="electricity" className="form-control form-control-sm" value={formData.electricity} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-6">
                            <label className="form-label small text-muted">Cooking Gas (kg)</label>
                            <input type="number" name="gas" className="form-control form-control-sm" value={formData.gas} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                    </div>
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="form-label small text-muted">Water Usage (Liters)</label>
                            <input type="number" name="water" className="form-control form-control-sm" value={formData.water} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-6">
                            <label className="form-label small text-muted">Wastewater (Liters)</label>
                            <input type="number" name="wastewater" className="form-control form-control-sm" value={formData.wastewater} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: TRAVEL & MOBILITY --- */}
                <div className="p-3 bg-light rounded mb-3 border">
                    <h6 className="text-success fw-bold mb-3">🚗 Travel & Mobility (km)</h6>
                    <div className="row g-2 mb-2">
                        <div className="col-4">
                            <label className="form-label small text-muted">Walking</label>
                            <input type="number" name="walking" className="form-control form-control-sm" value={formData.walking} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-4">
                            <label className="form-label small text-muted">EV / Bike</label>
                            <input type="number" name="evBike" className="form-control form-control-sm" value={formData.evBike} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-4">
                            <label className="form-label small text-muted">Car</label>
                            <input type="number" name="car" className="form-control form-control-sm" value={formData.car} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                    </div>
                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <label className="form-label small text-muted">Bus</label>
                            <input type="number" name="bus" className="form-control form-control-sm" value={formData.bus} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-6">
                            <label className="form-label small text-muted">Train / Metro</label>
                            <input type="number" name="trainMetro" className="form-control form-control-sm" value={formData.trainMetro} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                    </div>
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="form-label small text-muted">Flight</label>
                            <input type="number" name="flight" className="form-control form-control-sm" value={formData.flight} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                        <div className="col-6">
                            <label className="form-label small text-muted">Boat / Ferry</label>
                            <input type="number" name="boat" className="form-control form-control-sm" value={formData.boat} onChange={onInputChange} min="0" step="0.1" />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark btn-sm w-100 fw-bold py-2 mt-2" disabled={busy}>
                    {busy ? 'Calculating...' : 'Calculate Footprint'}
                </button>
            </form>
        </div>
    );
}

export default CarbonForm;