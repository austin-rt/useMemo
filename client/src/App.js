import './App.css';
import { useState } from 'react';
import { jacobsthal } from './constants/helpers';

function App() {
  const [number, setNumber] = useState(0);
  const [name, setName] = useState('');

  const result = jacobsthal(number);

  return (
    <div>
      <header className='App-header'>
        <section>
          <input
            type='text'
            value={number}
            placeholder='0'
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
          <div>{result || 0}</div>
        </section>
        <section>
          <input
            type='text'
            value={name}
            placeholder='name'
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <div>{name || 'name'}</div>
        </section>
      </header>
    </div>
  );
}

export default App;
