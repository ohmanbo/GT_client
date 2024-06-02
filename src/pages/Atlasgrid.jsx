/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

import styles from "./Atlasgrid.module.css";
import Canvas from "../components/Canvas";

let jsondata = [];
let JsonDataUpdated = false;

////////////////////////////////////////////////////////////////
// JSON 컴포넌트 (기존 json 파일을 읽어오던 코드)
/*
function LoadJson({ onDataLoaded }) {
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("/data.json")
        .then((response) => {
          onDataLoaded(response.data); // 데이터 로드 후 메인 컴포넌트에 전달
          console.log('loadJson()');
          JsonDataUpdated = true;
          //console.log('JsonDataUpdated = ', JsonDataUpdated);
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    fetchData(); // 컴포넌트 마운트 시 처음 데이터 로드
    const intervalId = setInterval(fetchData, 10000); // 10초마다 반복

    return () => clearInterval(intervalId); // 언마운트 시 인터벌 정리
  }, []);

  return <div>첫 번째 컴포넌트: 데이터 로딩 중...</div>;
}

*/
////////////////////////////////////////////////
// 수정된코드




////////////////////////////////////////////////

function loadImage(images, callback) {
  let loadedCount = 0;
  images.forEach((imgInfo) => {
    const img = new Image();
    img.onload = () => {
      imgInfo.image = img;
      imgInfo.loaded = true;
      //console.log(img.src + ' loaded'); // 왜 여러번 호출?
      loadedCount++;

      if (loadedCount === images.length) {
        callback();
      }
    };
    img.onerror = () => {
      console.log(img.src + " loading error");
    };

    img.src = imgInfo.src;
  });
}

const GRID_SIZE = 9;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

function getNeighbors(cellId) {
  let row = Math.floor(cellId / GRID_SIZE);
  let col = cellId % GRID_SIZE;

  let left = col === 0 ? cellId + (GRID_SIZE - 1) : cellId - 1;
  let right = col === GRID_SIZE - 1 ? cellId - (GRID_SIZE - 1) : cellId + 1;
  let up = row === 0 ? cellId + TOTAL_CELLS - GRID_SIZE : cellId - GRID_SIZE;
  let down =
    row === GRID_SIZE - 1
      ? cellId - TOTAL_CELLS + GRID_SIZE
      : cellId + GRID_SIZE;

  return [left, right, up, down];
}

function Atlasgrid() {
  let data_loaded = false;

  const CANVAS_WIDTH = 2304;
  const CANVAS_HEIGHT = 2304;
  const GRID_WIDTH = 256;
  const GRID_HEIGHT = 256;

  const BGImages = [
    {
      src: require("../images/bg.png"),
      globalAlpha: 1,
      imageType: "bg",
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/crab.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 4,
      y: 256 * 5,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/drake.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 8,
      y: 256 * 8,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/pig.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 6,
      y: 256,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/cyclops.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 0,
      y: 0,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/yeti.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256,
      y: 256 * 8,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/crocodile.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 6,
      y: 256 * 6,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/fireele.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 2,
      y: 256 * 2,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/rockele.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 2,
      y: 256 * 7,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/hydra.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 0,
      y: 256 * 4,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/kraken.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 4,
      y: 256 * 4,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
    {
      src: require("../images/scorpion.png"),
      globalAlpha: 0.2,
      imageType: "BossIcon",
      x: 256 * 8,
      y: 256 * 4,
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      loaded: false,
    },
  ];

  const [isCheckedBoss, setIsCheckedBoss] = useState(true); // 초기 상태는 false (체크되지 않음)
  const [isCheckedCrash, setIsCheckedCrash] = useState(false); // 초기 상태는 false (체크되지 않음)
  const [isCheckedNearding, setIsCheckedNearding] = useState(true); // 초기 상태는 false (체크되지 않음)

  function bossIconCheckboxChange(e) {
    setIsCheckedBoss(e.target.checked); // 체크 상태 변경
    initBG();
  }

  function servercrashCountingChange(e) {
    setIsCheckedCrash(e.target.checked); // 체크 상태 변경
  }
  function trackingNeardingChange(e) {
    setIsCheckedNearding(e.target.checked); // 체크 상태 변경
  }

  // offcreen canvas for BG
  const canvasBG = document.createElement("canvas");
  const ctxBG = canvasBG.getContext("2d");


  function LoadJson() {
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
                 
          jsondata = data.data.grid_data;
          JsonDataUpdated = true;
          gridUpdateTime = 0;
          
          
        })
        .catch(error => console.error('Error:', error));
      };
  
      // 함수를 즉시 한 번 호출하고,
      fetchData();
  
      // 그리고 10초(10000 밀리초)마다 반복 호출합니다.
      const interval = setInterval(fetchData, 10000);
  
      // 컴포넌트가 언마운트될 때 setInterval을 정리합니다.
      return () => clearInterval(interval);
    }, []); // 의존성 배열에 onDataLoaded를 추가하여, onDataLoaded가 변경될 때 useEffect가 다시 실행되도록 합니다.
  
    // 이 컴포넌트는 실제로 렌더링할 내용이 없으므로 null을 반환합니다.
    return null;
  }
  

  const startTime = Date.now();
  let currentTime = startTime;
  let lastTime = currentTime;
  let deltaTime = 0;

  let gridUpdateTime = 0;

  const [TotalPlayer, setTotalPlayer] = useState(0);
  const [TotalNearding, setTotalNearding] = useState(0);
  const [TotalContinuousNearding, setTotalContinuousNearding] = useState(0);

  LoadJson();

  let neardingData = []; // startCellId,
  let gridingData = []; // cellid, text, color, x, y, duration,

  const BoatImage = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      BoatImage.current = img;
      BoatImage.loaded = true;
    };
    img.onerror = () => {
      console.log("Error loading boat.png");
    };
    img.src = require("../images/boat.png");
  }, []);

  const draw = (context, count) => {
    context.save();
    
    currentTime = Date.now();
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    //console.log(deltaTime);

    if (data_loaded === false) {
      loadImage(BGImages, () => {
        canvasBG.width = context.canvas.width;
        canvasBG.height = context.canvas.height;

        data_loaded = true;
        initBG();
      });
    }
    // RENDER
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //context.fillStyle = "#040430";
    //context.fillRect(0, 0, 2304, 2304);

    context.drawImage(canvasBG, 0, 0);

    // 아래에 다이나믹한것 그리기
    drawServerInfo(context, count);
    drawGridingInfo(context, count);
    drawNeardingInfo(context, count);

    // server update sign
    drawUpdateInfo(context, count);
    context.restore();
  };

  const playerColors = {
    0: 'rgb(85, 85, 85)',    // Dark gray
    1: 'rgb(200, 200, 200)', // White
    2: 'rgb(200, 200, 0)',   // Yellow
    3: 'rgb(200, 180, 0)',   // Interpolated color
    4: 'rgb(200, 160, 0)',   // Interpolated color
    5: 'rgb(200, 140, 0)',   // Interpolated color
    6: 'rgb(200, 120, 0)',   // Orange
    7: 'rgb(200, 100, 0)',   // Interpolated color
    8: 'rgb(200, 80, 0)',   // Interpolated color
    9: 'rgb(200, 60, 0)',    // Interpolated color
    10: 'rgb(200, 40, 0)',   // Interpolated color
    11: 'rgb(200, 20, 0)',   // Interpolated color
    12: 'rgb(200, 0, 0)'     // Red
  };

  function drawServerInfo(ctx, count) {
    if (jsondata.length < 2) return;

    //console.log(jsondata);
    let latestData = jsondata[jsondata.length - 1].data;
    let previousData = jsondata[jsondata.length - 2].data;
    //마지막 업데이트 시간 문자열로 얻기.

    let totalPlayer = 0;

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        let cellId = i * 9 + j;
        let cellName = String.fromCharCode(65 + j) + (i + 1);
        let cellValue = latestData[cellId];
        let prevValue = previousData[cellId];

        let x = i * GRID_WIDTH + 48;
        let y = j * GRID_HEIGHT + 48;

        //console.log(typeof cellValue);
        if (!isNaN(parseInt(cellValue))) {
          let player_number = parseInt(cellValue);
          totalPlayer += player_number

          ctx.font = "100px GmarketSansLight";
          ctx.textBaseline = "top";
          ctx.textAlign = "left";

          if( player_number <= 12)
            ctx.fillStyle = playerColors[player_number]
          else
            ctx.fillStyle = playerColors[12]
          ctx.fillText(cellValue, x, y);
        } else { // 숫자가아닌경우
          ctx.font = "60px sans-serif";
          ctx.textBaseline = "top";
          ctx.textAlign = "center";
          ctx.fillStyle = "#800";
          ctx.fillText("OFFLINE", x + 55, y + 10);
          //offline++;
        }
        //console.log("working");
        if (JsonDataUpdated) {
         // console.log("working");
          if (!isNaN(cellValue) && !isNaN(prevValue)) {
            var change = parseInt(cellValue) - parseInt(prevValue);
            if (change !== 0) {
              // cellid, text, color, x, y, duration,

              // 셀값증가
              if (change > 0) {
                //console.log("griding!!!! ++ ")
                gridingData.push({
                  _cellId: cellId,
                  _text: "+" + change,
                  _color: "#0f0",
                  _x: x + 80,
                  _y: y + 40,
                  _duration: (change>=2?40000:20000),
                });

                // Nearding 검사
                const neighbors = getNeighbors(cellId);
                for (let neighborId of neighbors) {
                  if (latestData[neighborId] < previousData[neighborId]) {
                    console.log(
                      "Nearding 감지!!",
                      latestData[neighborId],
                      "<",
                      previousData[neighborId],
                      change
                    );
                    neardingData.push({ _cellID: cellId, _duration: 0}); 
                    break; // 조건이 충족되면 추가 검사를 중단
                    //Action()
                  }
                }

                //console.log(cellId, neighbors.length);

                // 셀값 감소
              } else if (change < 0) {
                //console.log("griding!!!! -- ")
                gridingData.push({
                  _cellId: cellId,
                  _text: change,
                  _color: "#f00",
                  _x: x + 85,
                  _y: y + 40,
                  _duration: 20000,
                });
              }
            }
          }
        }

        //var blinkClass = shouldBlink(cellId, currentTime) ? "blink" : ""; // 깜빡임 클래스 적용
        //var changeIndicators = renderChangeIndicators(cellId);

        //   tableContent += `<td class="${colorClass} ${blinkClass}"><div>${cellName}</div><div>${cellValue}${changeIndicators}</div></td>`;
      }
    }
    JsonDataUpdated = false;

    //console.log(totalPlayer);
    //setTotalPlayer(totalPlayer); 
    //setTotalNearding(neardingData.length);
    //setTotalContinuousNearding(continuousNeardingData.length); //    
  }

  function drawGridingInfo(ctx, count) {
      gridingData.forEach((item) => {
      
      const AnimationDistance_y = 80;

      ctx.font = "60px GmarketSansLight";
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillStyle = item._color;

      let animationY = (1 - item._duration / 20000) * AnimationDistance_y;
      ctx.fillText(item._text, item._x, item._y - animationY);

      if (deltaTime > 0 ) item._duration -= deltaTime;
      //console.log(item._duration);
    });

    // Duration 이 0보다 작으면 삭제.
    gridingData = gridingData.filter((item) => item._duration > 0);
  }

  function drawNeardingInfo(ctx, count) {
    if (!BoatImage.loaded) return;

    const offset_x = 30;
    const offset_y = 140;
    const imageSize_x = 100;
    const imageSize_y = 100;

    neardingData.forEach((item) => {
      let x = Math.floor(item._cellID / 9);
      let y = item._cellID % 9;

      ctx.drawImage(
        BoatImage.current,
        GRID_WIDTH * x + offset_x,
        GRID_HEIGHT * y + offset_y,
        imageSize_x,
        imageSize_y
      );

      ctx.font = "40px GmarketSansLight";
      ctx.textAlign = "left";
      ctx.fillStyle = "grey";

      let duration_sec = (item._duration / 1000)+10;
      ctx.fillText(`${Math.round(duration_sec)}s`,
      GRID_WIDTH * x + offset_x + 110,
      GRID_HEIGHT * y + offset_y + 50);

      item._duration += deltaTime;
    });

    console.log( neardingData.length );

    neardingData = neardingData.filter((item) => item._duration < 300000); // 5분후 제거
  }

  function drawUpdateInfo(ctx, count) {
    if (gridUpdateTime >= 210) return;
    const text = "Grid Info updated.";

    ctx.font = "60px GmarketSansLight";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    // 특정 프레임 구간에 속하는지 확인하여 텍스트를 그립니다.
    if (
      (gridUpdateTime >= 1 && gridUpdateTime <= 30) ||
      (gridUpdateTime >= 60 && gridUpdateTime <= 90) ||
      (gridUpdateTime >= 120 && gridUpdateTime <= 210)
    ) {
      ctx.fillStyle = "black";
      ctx.fillText(text, 900, 950); // Draw the text
    }

    gridUpdateTime++
    //console.log(gridUpdateTime++);
  }

  function initBG() {
    ctxBG.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    BGImages.forEach((imgInfo) => {
      if (imgInfo.loaded) {
        if (imgInfo.imageType === "BossIcon" && !isCheckedBoss) {
          //아무것도안함.
        } else {
          ctxBG.globalAlpha = imgInfo.globalAlpha;
          ctxBG.drawImage(
            imgInfo.image,
            imgInfo.x,
            imgInfo.y,
            imgInfo.width,
            imgInfo.height
          );
        }
      }
    });

    ctxBG.globalAlpha = 1.0;
    ctxBG.font = "40px GmarketSansMedium";
    ctxBG.textBaseline = "top";
    ctxBG.textAlign = "left";

    ctxBG.fillStyle = "#aaa";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        ctxBG.fillText(
          String.fromCharCode(i + 65) + (j + 1),
          i * 256 + 8,
          j * 256 + 8
        );
      }
    }
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.canvasContainer}>
          <div className={styles.topBox}>
            <input
              type="checkbox"
              id="bossIconCheckbox"
              checked={isCheckedBoss}
              onChange={bossIconCheckboxChange}
            />
            <label htmlFor="bossIconCheckbox">Boss Icons</label>

            <input
              type="checkbox"
              id="servercrashCounting"
              checked={isCheckedCrash}
              onChange={servercrashCountingChange}
            />
            <label htmlFor="servercrashCounting">Grid Crash Count</label>

            <input
              type="checkbox"
              id="trackingNearding"
              checked={isCheckedNearding}
              onChange={trackingNeardingChange}
            />
            <label htmlFor="trackingNearding">Nearding</label>
            <div>Total Player : {TotalPlayer}</div>
            <div>ToTal Nearding : {TotalNearding} [Nearby Griding]</div>
            <div>
              ToTal Continuous Nearding : {TotalContinuousNearding} [Nearding 2
              or more]
            </div>
          </div>

          <Canvas
            draw={draw}
            width="2304"
            height="2304"
            className={styles.canvas}
          />
        </div>
        <div className={styles.chatBox}>chatbox</div>
      </div>
    </>
  );
}

export default Atlasgrid;
