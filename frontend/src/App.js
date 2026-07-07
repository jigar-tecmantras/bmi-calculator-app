import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const categoryStyles = {
  Underweight: {
    color: '#0369a1',
    background: 'linear-gradient(140deg, rgba(14,165,233,0.15), rgba(14,165,233,0.05))',
    border: '1px solid rgba(14,165,233,0.35)',
  },
  Normal: {
    color: '#047857',
    background: 'linear-gradient(140deg, rgba(16,185,129,0.15), rgba(74,222,128,0.05))',
    border: '1px solid rgba(16,185,129,0.35)',
  },
  Overweight: {
    color: '#b91c1c',
    background: 'linear-gradient(140deg, rgba(239,68,68,0.15), rgba(251,113,133,0.05))',
    border: '1px solid rgba(239,68,68,0.35)',
  },
};

function App() {
  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const unitSettings = useMemo(() => {
    return unit === 'metric'
      ? { heightLabel: 'Height (cm)', weightLabel: 'Weight (kg)', placeholderHeight: '170', placeholderWeight: '70' }
      : { heightLabel: 'Height (inches)', weightLabel: 'Weight (lbs)', placeholderHeight: '67', placeholderWeight: '150' };
  }, [unit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!height || !weight) {
      setError('Please provide both height and weight.');
      return;
    }

    const payload = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      unit,
    };

    if (Number.isNaN(payload.height) || Number.isNaN(payload.weight) || payload.height <= 0 || payload.weight <= 0) {
      setError('Height and weight must be positive numbers.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bmi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Unable to calculate BMI right now.');
      }

      const data = await response.json();
      setResult({
        bmi: data.bmi,
        category: data.category,
        suggestion: data.suggestion,
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <header className="card-header">
          <p className="eyebrow">Wellness dashboard</p>
          <h1>Clean BMI calculator</h1>
          <p className="lead">
            Enter your height, weight, and preferred unit to receive an instant BMI snapshot with contextual guidance.
          </p>
        </header>

        <div className="toggle-group" role="group" aria-label="Unit selector">
          {['metric', 'imperial'].map((option) => (
            <button
              key={option}
              type="button"
              className={option === unit ? 'toggle active' : 'toggle'}
              onClick={() => setUnit(option)}
            >
              {option === 'metric' ? 'Metric' : 'Imperial'}
            </button>
          ))}
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-grid">
            <label>
              <span>{unitSettings.heightLabel}</span>
              <input
                type="number"
                inputMode="decimal"
                value={height}
                placeholder={unitSettings.placeholderHeight}
                onChange={(event) => setHeight(event.target.value)}
              />
            </label>

            <label>
              <span>{unitSettings.weightLabel}</span>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                placeholder={unitSettings.placeholderWeight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Calculating…' : 'Get BMI'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="result-panel" aria-live="polite">
          <div className="result-heading">
            <p className="result-label">BMI result</p>
            {result && (
              <span className="category-badge" style={categoryStyles[result.category] || {}}>
                {result.category}
              </span>
            )}
          </div>

          {result ? (
            <div className="result-content">
              <p className="bmi-value">{result.bmi.toFixed(1)}</p>
              <p className="suggestion">{result.suggestion}</p>
            </div>
          ) : (
            <p className="result-placeholder">Your BMI will be displayed here once you submit the form.</p>
          )}
        </div>

        <footer className="footer-note">
          This calculator provides an initial overview. For medical advice, consult a licensed provider.
        </footer>
      </section>
    </main>
  );
}

export default App;
