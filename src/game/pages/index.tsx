import { useContext } from 'react';
import { Dialog } from 'antd-mobile';
import { useHistory } from '@modern-js/runtime/router';
import { GlobalContext } from '@/context/globalContext';

import './index.less';

const Index = () => {
  const GlobalValue = useContext(GlobalContext);
  console.log('GlobalValue', GlobalValue);
  const history = useHistory();
  return (
    <div>
      <div className="flex flex-col w-2/3 m-auto ">
        <div className="title mb-10"></div>
        <div
          className="index-btn"
          onClick={() => {
            history.push('/info');
          }}>
          开始游戏
        </div>
        <div
          className="index-btn"
          onClick={() =>
            Dialog.alert({
              content: '这是一个弹窗会让用户选择游戏难度',
              onConfirm: () => {
                console.log('Confirmed');
              },
            })
          }>
          游戏设置
        </div>
        <div
          className="index-btn"
          onClick={() =>
            Dialog.alert({
              content: '这是一个弹窗解释说明游戏玩法',
              onConfirm: () => {
                console.log('Confirmed');
              },
            })
          }>
          游戏说明
        </div>
        <div
          className="index-btn"
          onClick={() => {
            history.push('/range');
          }}>
          排行榜
        </div>
      </div>
    </div>
  );
};

export default Index;
