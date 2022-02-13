import './info.less';
import { useEffect } from 'react';

const useAddMouseEventListener = (event: MouseEvent): any => {
  console.log('event', event.offsetY - 75, event.offsetX - 75, event);
  const mammonEle = document.getElementById('mammon');
  mammonEle.style.top = `${event.offsetY - 75}px`;
  mammonEle.style.left = `${event.offsetX - 75}px`;
  return '';
};

const Mammon = () => <div id="mammon" />;

const Info = () => {
  useEffect(() => {
    document.addEventListener('mouseover', useAddMouseEventListener);
    return () => {
      document.removeEventListener('mouseover', useAddMouseEventListener);
    };
  }, []);
  return <div>{Mammon()}</div>;
};

export default Info;
