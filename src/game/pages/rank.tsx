import './rank.less';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Rank = () => {
  const [records, setRecords] = useState<{ name: string; record: string }[]>(
    [],
  );
  useEffect(() => {
    axios
      .get('https://qcw93z.api.cloudendpoint.cn/getRecordsRank')
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(res => {
        setRecords([{ name: '排名：名字', record: '分数' }, ...res.data.data]);
      });
  }, []);
  const list = () =>
    records.map((item, index) => (
      <div className="rank-body " key={index}>
        <div className="rank-name pr-5 float-left ">
          <span
            style={(!index && { display: 'none' }) || { paddingRight: '21px' }}>
            {index}：
          </span>
          {item.name}
        </div>
        <div className="float-left">-------------------------</div>
        <div className="rank-record float-right">{item.record}</div>
      </div>
    ));
  return (
    <div className="rank">
      <div className="rank-title"></div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col">{list()}</div>
      </div>
    </div>
  );
};

export default Rank;
