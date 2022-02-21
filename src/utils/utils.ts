import { NFTStorage, File } from 'nft.storage';
import { Toast } from 'antd-mobile';
import { RouterProps } from '@modern-js/runtime/router';
import { mintNFT } from '@/hooks';
import { GlobalContextType } from '@/context/globalContext';

const NFT_STORAGE_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDcyZTMwMjhCNzVlMmNiMEExZWI3NzE3ZmNGOTg1ODIxODJBQWY0NjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NTI2NzkzOTk2NiwibmFtZSI6Ik5GVC1wb2x5Z29uIn0.LDdif1fKZXldpUXb535P1A9WNkTAQQV4D0OwWxjyElU';

// 将图片资源存在NFT.Storage
export const storeAsset = async (imageFile: File, record = 0) => {
  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
  const metadata = await client.store({
    name: 'QBB Record NFT',
    description: '由抢宝贝小游戏制造生成的用户游玩记录的证明',
    image: imageFile,
    attributes: [
      {
        trait_type: 'Game',
        value: 'QBB',
      },
      {
        trait_type: 'Status',
        value: 'Excellent',
      },
      {
        trait_type: 'Time',
        value: getExatTime(),
      },
      {
        trait_type: 'Record',
        value: record,
        display_type: 'number',
      },
    ],
  });
  return metadata;
};

export const getRandomInRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const getRandomInWindowWidth = (): number => {
  const windowWidth = window.innerWidth;
  return getRandomInRange(0, windowWidth - 100);
};

export const judgeRectCrash = (a: DOMRect, b: DOMRect): boolean => {
  // 假设a不动，b在变换位置，如果b始终在a的外围，那么就不会相撞，否则就是相撞了
  const buffer = 20;
  // 稍微留一点距离buffer， 因为人物并不是正方形的，留一点buffer体验更友好
  if (
    a.bottom - buffer < b.top ||
    a.left + buffer > b.right ||
    a.top + buffer > b.bottom ||
    a.right - buffer < b.left
  ) {
    return false;
  }
  return true;
};

// base64 转成file类型
export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = (/:(.*?);/.exec(arr[0]) || ['', 'image/png'])[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// 获得详细时间点描述
export const getExatTime = () => {
  const date = new Date(Date.now());
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
};

// 开启一个loadingprocess
const loadingWrap = async (cb: any) => {
  if (typeof cb === 'function') {
    try {
      Toast.show({
        icon: 'loading',
        content: '生成中',
        duration: 0,
        maskClickable: false,
      });
      await cb();
      Toast.clear();
    } catch (error: any) {
      Toast.show({
        icon: 'fail',
        content: error.message,
      });
    }
  }
};

// 返回首页的封装
export const backToIndex = (history: RouterProps['history']) => {
  history.replace('/');
  const crashAnimationEles = document.getElementsByClassName('crash-animation');
  Array.from(crashAnimationEles).forEach(ele =>
    ele?.parentNode?.removeChild(ele),
  );
};

// 画NFT图像，进行NFT图片上传，部署到合约里去
export const drawNFT = (
  globalContext: GlobalContextType,
  name: string,
  history: RouterProps['history'],
) => {
  try {
    Toast.show({
      icon: 'loading',
      content: '生成中',
      duration: 0,
    });
    const canvas = document.createElement('canvas');
    canvas.id = 'nft';
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '2';
    canvas.style.borderRadius = '20px';
    const img = new Image();
    // 防止跨域
    img.crossOrigin = 'Anonymous';
    // 背景图片
    img.src =
      'https://cloudflare-ipfs.com/ipfs/bafkreigxuumgryaphpf3e6yyuiyb62hgzrzrobrl6lxlrdyi4d7jnw3z7e';
    // eslint-disable-next-line max-statements
    img.onload = async function () {
      canvas.height = img.height / 3;
      canvas.width = img.width / 3;
      ctx.drawImage(img, 0, 0, img.width / 3, img.height / 3);
      canvas.style.left = `calc(50% - ${img.width / 6}px)`;
      canvas.style.top = `150px`;
      ctx.font = '16px bolder serif';
      ctx.fillStyle = '#fed994';
      ctx.fillText(`亲爱的${name}你好：`, 10, 50);
      ctx.font = '14px bold serif';
      ctx.fillText(
        `你在本次抢宝贝游戏中使用${globalContext.time}s获得${globalContext.record}分`,
        10,
        100,
      );
      ctx.fillText(`记录于 ${getExatTime()}`, 140, 150);
      const dataURL = canvas.toDataURL();
      const file = dataURLtoFile(dataURL, `QNFT-${new Date().getTime()}.png`);
      const confirmBtn = document.createElement('button');
      confirmBtn.id = 'confirm-nft-btn';
      confirmBtn.textContent = '确认铸造';
      confirmBtn.onclick = async () => {
        await loadingWrap(async () => {
          const tokenURI = await storeAsset(file, globalContext.record);
          const mintRes = await mintNFT(tokenURI.url, globalContext);
          ctx.fillText(`地址hash:`, 10, 200);
          ctx.font = '13px bold serif';
          ctx.fillText(`${mintRes.hash.slice(0, 33)}`, 10, 220);
          ctx.fillText(`${mintRes.hash.slice(33)}`, 10, 240);
        });
        confirmBtn.textContent = '关闭';
        confirmBtn.onclick = () => {
          Toast.show({
            icon: 'success',
            content: '已经成功生成Polygon NFT啦，快到testnet opensea中看一下吧',
          });
          document.body.removeChild(canvas);
          document.body.removeChild(confirmBtn);
          backToIndex(history);
        };
      };
      confirmBtn.classList.add(
        'adm-button',
        'adm-button-primary',
        'adm-button-shape-default',
        'absolute',
      );
      confirmBtn.style.left = 'calc(50% - 48px)';
      confirmBtn.style.top = '580px';
      document.body.appendChild(confirmBtn);
      Toast.clear();
    };
    document.body.appendChild(canvas);
  } catch (error: any) {
    Toast.show({
      icon: 'fail',
      content: error,
    });
  }
};
