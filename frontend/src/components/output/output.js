import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import './output.css';

const Output = ({ code }) => {
  const [output, setOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.current }),
      });

      const data = await response.json();
      if (data.error) {
        setOutput((prev) => [...prev, { type: 'error', message: data.error }]);
      } else {
        setOutput((prev) => [...prev, { type: 'success', message: data.result }]);
      }
    } catch (err) {
      setOutput((prev) => [...prev, { type: 'error', message: 'Execution failed' }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    setOutput([]);
  };

  return (
    <div className="output">
      <div className="output-actions">
        <button onClick={handleExecute} disabled={isExecuting} title="Run Code" className="action-btn">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={handleClear} title="Clear Output" className="action-btn">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="output-header">
        <span>Output</span>
      </div>
      <div className="output-content">
        {output.map((line, index) => (
          <div key={index} className={line.type === 'error' ? 'output-line error' : 'output-line success'}>
            {line.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Output;
