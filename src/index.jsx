import React from 'react';
import {createRoot} from 'react-dom/client';

function App() {
  return (
    <div>
          <h1>Hello from React!</h1>
          <button onClick={() => { throw new Error('Sentry React Test Error') }}>Throw error</button>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
