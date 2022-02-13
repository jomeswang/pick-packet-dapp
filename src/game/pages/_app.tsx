import { ComponentType } from 'react';
import { GlobalContext } from '@/context/globalContext';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';
import './_app.less';

const App = ({ Component, ...pageProps }: { Component: ComponentType }) => (
  <GlobalContext.Provider value={{ name: 'testForProvider' }}>
    <div className="bg">
      <Component {...pageProps} />
    </div>
  </GlobalContext.Provider>
);

export default App;
