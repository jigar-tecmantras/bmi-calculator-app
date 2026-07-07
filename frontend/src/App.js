import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const categoryDefinitions = [
  {
    max: 18.5,
    label: 'Underweight',
    suggestion: 'Consider consuming balanced meals with more calorie-dense foods and check in with a nutrition professional.',
  },
  {
    max: 24.9,
    label: 'Normal',
    suggestion: 'Maintain your habits, stay active, and keep up with regular health screenings to stay on track.',
  },
  {
    max: Infinity,
    label: 'Overweight',
    suggestion: 'Incorporate more movement, prioritize whole foods, and talk to your physician before major changes.',
  },
];

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
        <header>
          <p className="eyebrow">Health companion</p>
          <h1>Clean BMI Calculator</h1>
          <p className="lead">
            Enter your height and weight, pick a unit, and get a friendly summary, category, and suggestion.
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

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Calculating…' : 'Get BMI'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <article className="result-card">
            <div className="result-header">
              <p>BMI</p>
              <strong>{result.bmi.toFixed(1)}</strong>
            </div>
            <p className="category">{result.category}</p>
            <p className="suggestion">{result.suggestion}</p>
          </article>
        )}

        <footer className="footer-note">
          BMI is a starting point for tracking wellness. Discuss any major transitions with your provider.
        </footer>
      </section>
    </main>
  );
}

export default App;
