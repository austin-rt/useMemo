import React, { useState, useMemo } from 'react';
import { jacobsthal } from './helpers';

function App() {
  const [number, setNumber] = useState<number>(0);
  const [input, setInput] = useState<string>('');

  const calculation: number = useMemo((): number => {
    if (!number) {
      return jacobsthal(0);
    }
    return jacobsthal(number);
  }, [number]);

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
          <div className='result'>{calculation || 0}</div>
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
