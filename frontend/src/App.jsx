import React, { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Form States
  const [nwSellerId, setNwSellerId] = useState('');
  const [nwProductId, setNwProductId] = useState('');
  const [nwResult, setNwResult] = useState(null);

  const [scWarehouseId, setScWarehouseId] = useState('');
  const [scCustomerId, setScCustomerId] = useState('');
  const [scProductId, setScProductId] = useState('');
  const [scSpeed, setScSpeed] = useState('standard');
  const [scResult, setScResult] = useState(null);

  const [ccSellerId, setCcSellerId] = useState('');
  const [ccCustomerId, setCcCustomerId] = useState('');
  const [ccProductId, setCcProductId] = useState('');
  const [ccSpeed, setCcSpeed] = useState('standard');
  const [ccResult, setCcResult] = useState(null);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellersRes, customersRes, productsRes, warehousesRes] = await Promise.all([
          api.get('/sellers'),
          api.get('/customers'),
          api.get('/products'),
          api.get('/warehouses'),
        ]);
        setSellers(sellersRes.data);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load initial data. Ensure backend is running.');
      }
    };
    fetchData();
  }, []);

  const handleNearestWarehouse = async (e) => {
    e.preventDefault();
    setNwResult(null);
    setError('');
    try {
      const res = await api.get(`/warehouse/nearest`, {
        params: { sellerId: nwSellerId, productId: nwProductId }
      });
      setNwResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error finding nearest warehouse');
    }
  };

  const handleShippingCharge = async (e) => {
    e.preventDefault();
    setScResult(null);
    setError('');
    try {
      const res = await api.get(`/shipping-charge`, {
        params: { 
          warehouseId: scWarehouseId, 
          customerId: scCustomerId, 
          deliverySpeed: scSpeed,
          productId: scProductId 
        }
      });
      setScResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error calculating shipping charge');
    }
  };

  const handleCombinedCalculation = async (e) => {
    e.preventDefault();
    setCcResult(null);
    setError('');
    try {
      const res = await api.post(`/shipping-charge/calculate`, {
        sellerId: ccSellerId,
        customerId: ccCustomerId,
        deliverySpeed: ccSpeed,
        productId: ccProductId
      });
      setCcResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error calculating combined charge');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>E-Commerce Shipping Charge Estimator</h1>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {/* Section 1: Nearest Warehouse */}
        <div className="card">
          <h2>1. Get Nearest Warehouse</h2>
          <form onSubmit={handleNearestWarehouse}>
            <div className="form-group">
              <label>Select Seller:</label>
              <select value={nwSellerId} onChange={(e) => setNwSellerId(e.target.value)} required>
                <option value="">-- Select Seller --</option>
                {sellers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.location.lat}, {s.location.lng})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Product:</label>
              <select value={nwProductId} onChange={(e) => setNwProductId(e.target.value)} required>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.weight}kg)</option>)}
              </select>
            </div>
            <button type="submit">Find Warehouse</button>
          </form>
          {nwResult && (
            <div className="result">
              <h3>Result:</h3>
              <p><strong>Warehouse Name:</strong> {nwResult.warehouseName}</p>
              <p><strong>Warehouse ID:</strong> {nwResult.warehouseId}</p>
              <p><strong>Location:</strong> {nwResult.warehouseLocation.lat}, {nwResult.warehouseLocation.long}</p>
            </div>
          )}
        </div>

        {/* Section 2: Shipping Charge */}
        <div className="card">
          <h2>2. Get Shipping Charge</h2>
          <form onSubmit={handleShippingCharge}>
            <div className="form-group">
              <label>Select Warehouse:</label>
              <select value={scWarehouseId} onChange={(e) => setScWarehouseId(e.target.value)} required>
                <option value="">-- Select Warehouse --</option>
                {warehouses.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Customer:</label>
              <select value={scCustomerId} onChange={(e) => setScCustomerId(e.target.value)} required>
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Product:</label>
              <select value={scProductId} onChange={(e) => setScProductId(e.target.value)} required>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.weight}kg)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Delivery Speed:</label>
              <select value={scSpeed} onChange={(e) => setScSpeed(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
            <button type="submit">Calculate Charge</button>
          </form>
          {scResult && (
            <div className="result">
              <h3>Result:</h3>
              <p><strong>Shipping Charge:</strong> ₹{scResult.shippingCharge}</p>
            </div>
          )}
        </div>

        {/* Section 3: Combined Calculation */}
        <div className="card">
          <h2>3. Calculate Combined (Seller &rarr; Customer)</h2>
          <form onSubmit={handleCombinedCalculation}>
            <div className="form-group">
              <label>Select Seller:</label>
              <select value={ccSellerId} onChange={(e) => setCcSellerId(e.target.value)} required>
                <option value="">-- Select Seller --</option>
                {sellers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Customer:</label>
              <select value={ccCustomerId} onChange={(e) => setCcCustomerId(e.target.value)} required>
                <option value="">-- Select Customer --</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Product:</label>
              <select value={ccProductId} onChange={(e) => setCcProductId(e.target.value)} required>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.weight}kg)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Delivery Speed:</label>
              <select value={ccSpeed} onChange={(e) => setCcSpeed(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
            <button type="submit">Calculate Combined</button>
          </form>
          {ccResult && (
            <div className="result">
              <h3>Result:</h3>
              <p><strong>Shipping Charge:</strong> ₹{ccResult.shippingCharge}</p>
              <p><strong>Nearest Warehouse Name:</strong> {ccResult.nearestWarehouse.warehouseName}</p>
              <p><strong>Nearest Warehouse Location:</strong> {ccResult.nearestWarehouse.warehouseLocation.lat}, {ccResult.nearestWarehouse.warehouseLocation.long}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
