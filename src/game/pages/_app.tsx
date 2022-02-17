import { ComponentType, useState } from 'react';
import { GlobalContext, globalInitValue } from '@/context/globalContext';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';
import './_app.less';

const App = ({ Component, ...pageProps }: { Component: ComponentType }) => {
  const [difficulty, setDifficulty] = useState(globalInitValue.difficulty);
  const [time, setTime] = useState(globalInitValue.time);
  const [record, setRecord] = useState(globalInitValue.record);
  return (
    <GlobalContext.Provider
      value={{
        difficulty,
        setDifficulty,
        time,
        setTime,
        record,
        setRecord,
      }}>
      <div className="bg">
        <Component {...pageProps} />
      </div>
    </GlobalContext.Provider>
  );
};
export default App;
