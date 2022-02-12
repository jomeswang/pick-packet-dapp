import { ComponentType } from 'react';
import { GlobalContext } from '@/context/globalContext';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';

const App = ({ Component, ...pageProps }: { Component: ComponentType }) => (
  <GlobalContext.Provider value={{ name: 'testForProvider' }}>
    <Component {...pageProps} />
  </GlobalContext.Provider>
);

export default App;
