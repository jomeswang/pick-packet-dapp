import { useContext } from 'react';
import { Dialog, Modal, Radio, Space } from 'antd-mobile';
import { useHistory } from '@modern-js/runtime/router';
import { GlobalContext } from '@/context/globalContext';
import { connectWallet, useInitWeb3Modal } from '@/hooks';
import './index.less';

const Index = () => {
  const globalContext = useContext(GlobalContext);
  const history = useHistory();
  useInitWeb3Modal();
  const tempSetting = {
    difficulty: globalContext.difficulty,
    time: globalContext.time,
  };

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
          onClick={() => {
            Dialog.show({
              header: (
                <div className="text-center font-semibold text-2xl">设置</div>
              ),
              closeOnAction: true,
              actions: [
                [
                  {
                    key: 'cancel',
                    text: '取消',
                  },
                  {
                    key: 'confirm',
                    text: '确认',
                    onClick: () => {
                      globalContext.setDifficulty(tempSetting.difficulty);
                      globalContext.setTime(tempSetting.time);
                    },
                  },
                ],
              ],
              content: (
                <div>
                  <div className="mt-4">
                    难度设置：
                    <Radio.Group
                      defaultValue={globalContext.difficulty}
                      onChange={val => {
                        tempSetting.difficulty = val as number;
                      }}>
                      <Space direction="horizontal">
                        <Radio value={0}>低</Radio>
                        <Radio value={1}>中</Radio>
                        <Radio value={2}>高</Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                  <div className="mt-4">
                    时间设置：
                    <Radio.Group
                      defaultValue={globalContext.time}
                      onChange={val => {
                        tempSetting.time = val as number;
                      }}>
                      <Space style={{ '--gap': '15px' }} direction="horizontal">
                        <Radio value={90}>90s</Radio>
                        <Radio value={60}>60s</Radio>
                        <Radio value={30}>30s</Radio>
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              ),
            });
          }}>
          游戏设置
        </div>
        <div
          className="index-btn"
          onClick={() =>
            Dialog.alert({
              header: (
                <div className="text-center font-semibold text-2xl">
                  游戏规则
                </div>
              ),
              content:
                '用户可以拖动财神来接天上掉下来的财宝，得到元宝+10分，得到红包+5分，碰到大便-5分，碰到炸弹会阻碍用户视线，不会扣分，最后用户可以在排行榜中记录自己的成绩',
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
            history.push('/rank');
          }}>
          排行榜
        </div>
        <div
          className="index-btn"
          onClick={() => {
            if (globalContext.address) {
              Modal.show({
                content: (
                  <div>
                    钱包已连接：
                    {`${globalContext.address.slice(
                      0,
                      8,
                    )}...${globalContext.address.slice(35)}`}
                  </div>
                ),
                closeOnAction: true,
                closeOnMaskClick: true,
                actions: [
                  {
                    key: 'confirm',
                    text: '我知道了',
                    primary: true,
                  },
                ],
              });
              return;
            }
            Modal.show({
              content: '选择连接钱包',
              closeOnAction: true,
              closeOnMaskClick: true,
              actions: [
                {
                  key: 'MetaMask',
                  text: 'MetaMask',
                  primary: true,
                  onClick: () => {
                    connectWallet(globalContext);
                  },
                },
                {
                  key: 'WalletConnect',
                  text: 'WalletConnect',
                  primary: true,
                  onClick: () => {
                    connectWallet(globalContext, 'walletconnect');
                  },
                },
              ],
            });
          }}>
          连接钱包
        </div>
      </div>
    </div>
  );
};

export default Index;
