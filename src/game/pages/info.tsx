import './info.less';
import { useEffect, useContext, useMemo } from 'react';
import Lottie from 'lottie-web';
import { Tween, Easing, update } from '@tweenjs/tween.js';
import {
  getRandomInWindowWidth,
  getRandomInRange,
  judgeRectCrash,
} from '@/utils/utils';
import { GlobalContext } from '@/context/globalContext';
import AliasRandom from '@/utils/aliasRandom';
import { DIFFICULTY_SETTINGS } from '@/utils/const';
import BumpAnimateData from '@/assets/json/bump.json';

type Dict = { [k: string]: any };

const ContextValue = {
  material: {},
  mammon: [],
  bump: {} as Dict, // 存储已爆炸物料
};

// 监听手指移动事件
const useAddTouchMoveEventListener = (event: TouchEvent): any => {
  event.preventDefault();
  const mammonEle = document.getElementById('mammon');
  if (mammonEle) {
    mammonEle.style.top = `${event.touches[0].pageY - 75}px`;
    mammonEle.style.left = `${event.touches[0].pageX - 75}px`;
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
      // Called after tween.js updates 'coords'.
      // Move 'box' to the position described by 'coords' with a CSS translation.
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
const detectCrashAction = (ele: HTMLDivElement, globalContext: any) => {
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

    if (ele.classList.contains('packet')) {
      crashAnimationEle.classList.add('c-5');
      TweenReverseWrap(crashAnimationEle, true);
      TweenReverseWrap(ele, false);
      globalContext.setRecord((item: number) => item + 5);
    }

    if (ele.classList.contains('yuanbao')) {
      crashAnimationEle.classList.add('c-10');
      TweenReverseWrap(crashAnimationEle, true);
      TweenReverseWrap(ele, false);
      globalContext.setRecord((item: number) => item + 10);
    }

    if (ele.classList.contains('bian')) {
      crashAnimationEle.classList.add('c-5-');
      TweenReverseWrap(crashAnimationEle, true);
      TweenReverseWrap(ele, false);
      globalContext.setRecord((item: number) => item - 5);
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
const MaterialFactory = (name: string, speed: number, context: any) => {
  let count = 0;
  const infoEle = document.getElementById('info');
  const collectionsEle = document.createElement('div');
  collectionsEle.id = name;
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
      detectCrashAction(ele, context);
      // tween 添加这一个来改变数据
      update(time);
      animationFrameHandle = requestAnimationFrame(animate);
    };
    animationFrameHandle = requestAnimationFrame(animate);
  };
};

// 游戏数据 剩余时间
const InfoData = () => {
  const globalContext = useContext(GlobalContext);
  return (
    <div className="info-data">
      <div className="time">时间：{globalContext.time}s</div>
      <div className="record">分数：{globalContext.record}</div>
    </div>
  );
};

// 游戏主体
const Info = () => {
  const globalContext = useContext(GlobalContext);
  // 使用 alias method产生随机掉落的物料
  const voseAliasMethod = useMemo(
    () =>
      new AliasRandom.VoseAliasMethod(
        DIFFICULTY_SETTINGS[globalContext.difficulty].probability,
      ),
    [globalContext.difficulty],
  );
  let count = 0;
  useEffect(() => {
    // 掉落物料注册
    const factoryArr = ['yuanbao', 'packet', 'bump', 'bian'].map(item =>
      MaterialFactory(
        item,
        DIFFICULTY_SETTINGS[globalContext.difficulty].speed,
        globalContext,
      ),
    );
    const dropAnimate = () => {
      const randomNum = getRandomInRange(0, 100);
      if (randomNum < 4) {
        const chosenIndex = voseAliasMethod.next();
        factoryArr[chosenIndex]();
        count++;
      }
      if (count < 100) {
        requestAnimationFrame(dropAnimate);
      }
    };
    requestAnimationFrame(dropAnimate);
  }, []);

  return (
    <div id="info">
      {Mammon()}
      {InfoData()}
    </div>
  );
};

export default Info;
