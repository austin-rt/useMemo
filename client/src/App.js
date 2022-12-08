import './App.css';
import { useState, useCallback, useMemo } from 'react';

function App() {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');

  const jacobsthal = useCallback((n, previousValues = []) => {
    if (previousValues[n]) {
      return previousValues[n];
    }
    let result;
    if (n < 2) {
      result = n;
    } else {
      result = jacobsthal(n - 1, previousValues) + 2 * jacobsthal(n - 2, previousValues);
    }
    previousValues[n] = result;
    return result;
  }, []);

  const calculation = useMemo(() => {
    return jacobsthal(number);
  }, [number, jacobsthal]);

  return (
    <div>
      <main>
        <section>
          <div className='user-input'>
            <input
              type='text'
              value={number}
              placeholder='desired index'
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
          </div>
          <div className='result'>{calculation || 0}</div>
        </section>
        <section>
          <div className='user-input'>
            <input
              type='text'
              value={input}
              placeholder='user input'
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </div>
          <div className='result'>{input || '--'}</div>
        </section>
      </main>
    </div>
  );
}

export default App;
