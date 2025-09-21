import React from 'react';
import Analytics from './Analytics';
import QRCodeDisplay from './QRcodeDisplay';

const MAX_URLS = 5;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const Frontend = () => {
  const [inputs, setInputs] = React.useState([
    { longUrl: '', validity: '', shortcode: '', error: '', loading: false, result: null }
  ]);

  // Add new input row (up to 5)
  const addInput = () => {
    if (inputs.length < MAX_URLS) {
                setInputs([...inputs, { longUrl: '', validity: '', shortcode: '', error: '', loading: false, result: null }]);
              }
            };

            // Remove input row
            const removeInput = idx => {
              setInputs(inputs.filter((_, i) => i !== idx));
            };

            // Handle input change
            const handleChange = (idx, field, value) => {
              setInputs(inputs.map((input, i) => i === idx ? { ...input, [field]: value, error: '', result: null } : input));
            };

            // Validate all inputs
            const validateInputs = () => {
              let valid = true;
              const newInputs = inputs.map(input => {
                let error = '';
                if (!input.longUrl) {
                  error = 'URL is required.';
                } else if (!isValidUrl(input.longUrl)) {
                  error = 'Invalid URL format.';
                } else if (input.validity && (!/^\d+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
                  error = 'Validity must be a positive integer.';
                } else if (input.shortcode && !/^\w+$/.test(input.shortcode)) {
                  error = 'Shortcode must be alphanumeric.';
                }
                if (error) valid = false;
                return { ...input, error };
              });
              setInputs(newInputs);
              return valid;
            };

            // Shorten all valid URLs concurrently
            const handleShortenAll = async () => {
              if (!validateInputs()) return;
              setInputs(inputs => inputs.map(input => ({ ...input, loading: true, error: '', result: null })));

              const requests = inputs.map(async (input, idx) => {
                try {
                  // Prepare expiry (validity in min) as expiry date string
                  let expiryDate = null;
                  if (input.validity) {
                    const mins = parseInt(input.validity);
                    expiryDate = new Date(Date.now() + mins * 60000);
                  }
                  // TinyURL API does not support expiry/shortcode in free tier, so we simulate
                  const res = await fetch('http://localhost:5000/api/shorten', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        url: input.longUrl,
                        validity: input.validity,
                        alias: input.shortcode
                      })
                    });
                  const data = await res.json();
                  if (data.data && data.data.tiny_url) {
                    return {
                      ...input,
                      loading: false,
                      result: {
                        shortUrl: data.data.tiny_url,
                        expiry: expiryDate ? expiryDate.toLocaleString() : 'No expiry',
                        longUrl: input.longUrl
                      },
                      error: ''
                    };
                  } else {
                    return { ...input, loading: false, error: 'Failed to shorten URL.', result: null };
                  }
                } catch {
                  return { ...input, loading: false, error: 'Error occurred.', result: null };
                }
              });

              const results = await Promise.all(requests);
              setInputs(results);
            };

            return (
                <div className="url-shortener-container">
                  <h2 className="url-shortener-title">URL Shortener (up to 5 at once)</h2>
                  {inputs.map((input, idx) => (
                    <div key={idx} className="url-input-row">
                      <div className="url-input-fields">
                        <input
                          type="text"
                          placeholder="Enter long URL"
                          value={input.longUrl}
                          onChange={e => handleChange(idx, 'longUrl', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Validity (min, optional)"
                          value={input.validity}
                          onChange={e => handleChange(idx, 'validity', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Shortcode (optional)"
                          value={input.shortcode}
                          onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                        />
                        {inputs.length > 1 && (
                          <button className="remove-btn" onClick={() => removeInput(idx)}>×</button>
                        )}
                      </div>
                      {input.error && <div className="error-msg">{input.error}</div>}
                      {input.result && (
                        <div className="result-section">
                          <strong>Short URL:</strong> <a href={input.result.shortUrl} target="_blank" rel="noopener noreferrer">{input.result.shortUrl}</a>
                          <button className="copy-btn" onClick={() => navigator.clipboard.writeText(input.result.shortUrl)}>Copy</button>
                          <div className="expiry-info">
                            <strong>Expiry:</strong> {input.result.expiry}
                          </div>
                          <div className="original-info">
                            <strong>Original:</strong> {input.result.longUrl}
                          </div>
                          <Analytics shortcode={input.shortcode} />
                          <QRCodeDisplay shortcode={input.shortcode} />
                        </div>
                      )}
                      {input.loading && <div className="loading-msg">Shortening...</div>}
                    </div>
                  ))}
                  <div className="action-btns">
                    <button
                      className="add-btn"
                      onClick={addInput}
                      disabled={inputs.length >= MAX_URLS}
                    >
                      + Add URL
                    </button>
                    <button
                      onClick={handleShortenAll}
                    >
                      Shorten All
                    </button>
                  </div>
                </div>
            );
          };

          export default Frontend;
