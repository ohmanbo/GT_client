import { useEffect } from 'react';

function LoadJson({ onDataLoaded }) {
  useEffect(() => {
    const fetchData = () => {
      fetch('http://127.0.0.1:8001/atlasgrid/monitor/?what=gridinfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        if (onDataLoaded) onDataLoaded(data);
      })
      .catch(error => console.error('Error:', error));
    };

    // 함수를 즉시 한 번 호출하고,
    fetchData();

    // 그리고 10초(10000 밀리초)마다 반복 호출합니다.
    const interval = setInterval(fetchData, 10000);

    // 컴포넌트가 언마운트될 때 setInterval을 정리합니다.
    return () => clearInterval(interval);
  }, [onDataLoaded]); // 의존성 배열에 onDataLoaded를 추가하여, onDataLoaded가 변경될 때 useEffect가 다시 실행되도록 합니다.

  // 이 컴포넌트는 실제로 렌더링할 내용이 없으므로 null을 반환합니다.
  return null;
}

export default LoadJson;