import { useContext } from 'react';
import { Button, Dialog } from 'antd-mobile';
import { useHistory } from '@modern-js/runtime/router';
import { GlobalContext } from '@/context/globalContext';

const Info = () => {
  const GlobalValue = useContext(GlobalContext);
  console.log('GlobalValue', GlobalValue);
  const history = useHistory();
  return (
    <div className="text-green-400">
      <div className="flex flex-col w-2/3 m-auto mt-72">
        <div className="text-center text-2xl mb-10">PICK-PACkET-DAPP</div>
        <Button
          onClick={() => {
            history.push('/info');
          }}>
          开始游戏
        </Button>
        <Button
          onClick={() =>
            Dialog.alert({
              content: '这是一个弹窗会让用户选择游戏难度',
              onConfirm: () => {
                console.log('Confirmed');
              },
            })
          }>
          游戏设置
        </Button>
        <Button
          onClick={() =>
            Dialog.alert({
              content: '这是一个弹窗解释说明游戏玩法',
              onConfirm: () => {
                console.log('Confirmed');
              },
            })
          }>
          游戏说明
        </Button>
        <Button
          onClick={() => {
            history.push('/range');
          }}>
          排行榜
        </Button>
      </div>
    </div>
  );
};

export default Info;
