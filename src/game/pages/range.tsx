import './range.less';

const Range = () => {
  const arr = [
    {
      name: 'susu',
      score: 100,
    },
    {
      name: 'susu1',
      score: 200,
    },
    {
      name: 'susu2',
      score: 300,
    },
  ];
  const list = () =>
    arr.map((item, index) => (
      <div key={index}>
        {item.name} ----- {item.score}
      </div>
    ));
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col">{list()}</div>{' '}
    </div>
  );
};

export default Range;
