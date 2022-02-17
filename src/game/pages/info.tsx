/* eslint-disable max-lines */
import './info.less';
import {
  useEffect,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { useHistory, RouterProps } from '@modern-js/runtime/router';
import Lottie from 'lottie-web';
import { Tween, Easing, update } from '@tweenjs/tween.js';
import { Dialog, Input, Toast } from 'antd-mobile';
import { DialogShowProps } from 'antd-mobile/es/components/dialog';
import axios from 'axios';
import {
  getRandomInWindowWidth,
  getRandomInRange,
  judgeRectCrash,
} from '@/utils/utils';
import { GlobalContext, globalInitValue } from '@/context/globalContext';
import AliasRandom from '@/utils/aliasRandom';
import { DIFFICULTY_SETTINGS, MATERIAL_ANIMATION_MAP } from '@/utils/const';
import BumpAnimateData from '@/assets/json/bump.json';

type Dict = { [k: string]: any };

type InitType = {
  globalContext: {
    difficulty: any;
    time?: number;
    record?: number;
    setDifficulty?: any;
    setTime?: any;
    setRecord?: any;
  };
  setTime?: any;
  setRecord: Dispatch<SetStateAction<number>>;
  raf: { requestAnimationFrame: any; cancelAnimationFrame: any };
  voseAliasMethod: any;
  history: any;
  record: number;
};

const ContextValue = {
  material: {},
  mammon: [],
  bump: {} as Dict, // 存储已爆炸物料
  stop: false,
};

// 封装一下raf函数，更好的取消
const rafWrapper = () => {
  let handlers: number[] = [];
  return {
    requestAnimationFrame: (cb: any) => {
      const handler = requestAnimationFrame(cb);
      handlers.push(handler);
      return handler;
    },
    cancelAnimationFrame: (handler = 0) => {
      if (!handler) {
        handlers.forEach(item => cancelAnimationFrame(item));
        handlers = [];
      } else {
        cancelAnimationFrame(handler);
      }
    },
  };
};

// 监听手指移动事件
const useAddTouchMoveEventListener = (event: TouchEvent): any => {
  if (!ContextValue.stop) {
    event.preventDefault();
    const mammonEle = document.getElementById('mammon');
    if (mammonEle) {
      mammonEle.style.top = `${event.touches[0].pageY - 75}px`;
      mammonEle.style.left = `${event.touches[0].pageX - 75}px`;
    }
  }
};

// 财神
const Mammon = () => {
  useEffect(() => {
    document.addEventListener('touchmove', useAddTouchMoveEventListener, {
      passive: false,
    });
    return () => {
      document.removeEventListener('touchmove', useAddTouchMoveEventListener);
    };
  }, []);
  return <div id="mammon" />;
};

// 放大隐藏动画封装
const TweenReverseWrap = (ele: HTMLDivElement, toSmall = true) => {
  const setting = { x: 1, y: 1, opacity: 1 };
  const changeMap = [0, 1.3];
  new Tween(setting) // Create a new tween that modifies 'setting'.
    .to(
      {
        x: changeMap[Number(toSmall)],
        y: changeMap[Number(toSmall)],
        opacity: 0.5,
      },
      400,
    )
    .easing(Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(() => {
      ele.style.setProperty('transform', `scale(${setting.x}, ${setting.y})`);
    })
    .onComplete(() => {
      ele.parentNode?.removeChild(ele);
    })
    .start(); // Start the tween immediately.
};

// 掉落操作dom
const dropAction = (
  ele: HTMLDivElement,
  speed: number,
  animationFrameHandle: number,
) => {
  const offsetTop = ele.getBoundingClientRect().top + speed;
  ele.style.top = `${offsetTop}px`;
  if (offsetTop > window.innerHeight + 5) {
    cancelAnimationFrame(animationFrameHandle);
    ele.parentNode?.removeChild(ele);
  }
};

// 物料和财神的碰撞检测
// eslint-disable-next-line max-statements
const detectCrashAction = (ele: HTMLDivElement, setRecord: any) => {
  const mammonElePosition = document
    .getElementById('mammon')
    ?.getBoundingClientRect();
  const elePosition = ele.getBoundingClientRect();
  if (
    mammonElePosition &&
    judgeRectCrash(mammonElePosition, elePosition) &&
    !ContextValue.bump[ele.className]
  ) {
    ContextValue.bump[ele.className] = true;
    const crashAnimationEle: HTMLDivElement | null =
      document.createElement('div');
    crashAnimationEle.classList.add('crash-animation');
    crashAnimationEle.style.left = `${elePosition.left}px`;
    crashAnimationEle.style.top = `${elePosition.top}px`;
    document.body.appendChild(crashAnimationEle);

    type MatchType = keyof typeof MATERIAL_ANIMATION_MAP | null;

    // 给物料添加放大缩写退出动画
    const match: MatchType = /packet|yuanbao|bian/.exec(
      ele.className,
    ) as MatchType;
    if (match) {
      crashAnimationEle.classList.add(MATERIAL_ANIMATION_MAP[match].className);
      TweenReverseWrap(crashAnimationEle, true);
      TweenReverseWrap(ele, false);
      setRecord((item: number) => item + MATERIAL_ANIMATION_MAP[match].record);
    }

    // 添加爆炸动画
    if (ele.classList.contains('bump')) {
      // 添加补间动画
      TweenReverseWrap(ele, true);
      const animate = Lottie.loadAnimation({
        container: crashAnimationEle,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: BumpAnimateData,
      });
      animate.addEventListener('complete', () => {
        document.body.removeChild(crashAnimationEle);
        animate.destroy();
      });
    }
  }
};

// 掉落物料生产工厂
const MaterialFactory = (
  name: string,
  speed: number,
  setRecord: any,
  raf: any,
) => {
  const matchEle = document.getElementById(`${name}s`);
  if (matchEle) {
    matchEle.parentNode?.removeChild(matchEle);
  }
  let count = 0;
  const infoEle = document.getElementById('info');
  const collectionsEle = document.createElement('div');
  collectionsEle.id = `${name}s`;
  infoEle?.appendChild(collectionsEle);
  return () => {
    let animationFrameHandle: number;
    count += 1;
    const ele = document.createElement('div');
    ele.classList.add(name, `${name}-${count}`, 'drop');
    ele.style.left = `${getRandomInWindowWidth()}px`;
    collectionsEle.appendChild(ele);
    // 物体掉落动画
    const animate = (time: number) => {
      // 掉落动作
      dropAction(ele, speed, animationFrameHandle);
      // 掉落碰撞检测
      detectCrashAction(ele, setRecord);
      // tween 添加这一个来改变数据
      update(time);
      animationFrameHandle = raf.requestAnimationFrame(animate);
    };
    animationFrameHandle = raf.requestAnimationFrame(animate);
  };
};

// 游戏数据 剩余时间
const InfoData = ({ time = 0, record = 0 }) => (
  <div className="info-data">
    <div className="base-data">时间：{time}s</div>
    <div className="base-data">分数：{record}</div>
  </div>
);

// 返回首页的封装
const backToIndex = (history: RouterProps['history']) => {
  history.replace('/');
  const crashAnimationEles = document.getElementsByClassName('crash-animation');
  Array.from(crashAnimationEles).forEach(ele =>
    ele?.parentNode?.removeChild(ele),
  );
};

// 游戏结束弹窗
const GameOver = (props: InitType) => {
  ContextValue.stop = true;
  let name = '';
  const config: DialogShowProps = {
    header: <div>游戏结束</div>,
    content: (
      <div>
        <div>你的游戏分数为：55</div>
        <div>请留下你的大名，方便在排行榜中展示</div>
        <Input
          placeholder="请输入名字"
          className="name-input"
          onChange={val => {
            name = val;
          }}
        />
      </div>
    ),
    closeOnAction: true,
    actions: [
      [
        {
          key: 'restart',
          text: '重新开始',
          onClick: () => {
            init(props);
          },
        },
        {
          key: 'reback',
          text: '返回首页',
          onClick: () => {
            backToIndex(props.history);
          },
        },
        {
          key: 'preserve',
          text: '保存',
          onClick: () => {
            Toast.show({
              icon: 'loading',
              content: '保存中',
            });
            props.setRecord(record => {
              Toast.show({
                icon: 'success',
                content: '保存成功',
              });
              backToIndex(props.history);
              axios.post('https://qcw93z.api.cloudendpoint.cn/addRecord', {
                data: {
                  name,
                  record,
                },
              });
              return record;
            });
          },
        },
      ],
    ],
  };
  Dialog.show(config);
};

// 初始化数据
const init = ({
  globalContext,
  setRecord,
  setTime,
  raf,
  voseAliasMethod,
  history,
  record,
}: InitType) => {
  setTime(globalContext.time || 60);
  setRecord(0);
  ContextValue.stop = false;
  ContextValue.bump = {};
  const mammon = document.getElementById('mammon');
  if (mammon) {
    mammon.style.left = 'calc(50% - 75px)';
    mammon.style.top = '80%';
  }
  let rafCount = 0;
  // 掉落物料注册
  const factoryArr = ['yuanbao', 'packet', 'bump', 'bian'].map(item =>
    MaterialFactory(
      item,
      DIFFICULTY_SETTINGS[globalContext.difficulty].speed,
      setRecord,
      raf,
    ),
  );
  const dropAnimate = () => {
    rafCount++;
    const randomNum = getRandomInRange(0, 100);
    if (randomNum < 4) {
      const chosenIndex = voseAliasMethod.next();
      factoryArr[chosenIndex]();
    }
    if (rafCount % 60 === 0) {
      rafCount = 0;
      let timet = globalInitValue.time;
      setTime((timec: number) => {
        timet = timec - 1;
        return timet;
      });
      if (timet <= 50) {
        // 取消所有动画
        raf.cancelAnimationFrame();
        GameOver({
          globalContext,
          setRecord,
          setTime,
          raf,
          voseAliasMethod,
          history,
          record,
        });
        return;
      }
    }
    raf.requestAnimationFrame(dropAnimate);
  };
  raf.requestAnimationFrame(dropAnimate);
};

// 游戏主体
const Info = () => {
  const globalContext = useContext(GlobalContext);
  const history = useHistory();
  const [time, setTime] = useState(globalContext.time);
  const [record, setRecord] = useState(globalContext.record);
  const raf = rafWrapper();
  // 使用 alias method产生随机掉落的物料
  const voseAliasMethod = useMemo(
    () =>
      new AliasRandom.VoseAliasMethod(
        DIFFICULTY_SETTINGS[globalContext.difficulty].probability,
      ),
    [globalContext.difficulty],
  );
  useEffect(() => {
    init({
      globalContext,
      setRecord,
      setTime,
      raf,
      voseAliasMethod,
      history,
      record,
    });
  }, []);

  return (
    <div id="info">
      {/* 财神 */}
      {Mammon()}
      {/* 游戏数据得分和剩余时间 */}
      {InfoData({ time, record })}
    </div>
  );
};

export default Info;
