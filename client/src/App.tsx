import React, { useState, useCallback } from 'react';

function App() {
  const [number, setNumber] = useState<number>(0);
  const [input, setInput] = useState<string>('');

  const jacobsthal = useCallback((n: number): number => {
    if (!n) return 0;
    if (n < 2) return n;
    return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  }, []);

  const calculation = (n: number) => {
    if (!n) {
      return jacobsthal(0);
    }
    return jacobsthal(n);
  };

  return (
    <div>
      <main>
        <section>
          <div className='user-input'>
            <input
              autoFocus
              type='number'
              value={number || ''}
              placeholder='desired index'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNumber(e.target.valueAsNumber);
              }}
            />
          </div>
          <div className='result'>{calculation(number) || 0}</div>
        </section>
        <section>
          <div className='user-input'>
            <input
              type='text'
              value={input}
              placeholder='user input'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
