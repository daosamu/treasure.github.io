const statusDiv = document.getElementById('status');
const nextButton = document.getElementById('nextButton');
const treasureChestImage = document.getElementById('treasureChestImage');

let step = 0;
let templeSearchAttempts = 0;

const steps = [
  "获取初始线索",
  "解码古代文字",
  "搜索神庙",
  "解密宝箱机关",
  "打开宝箱"
];

const mapData = [
  '图书馆',
  '图书馆',
  '神庙入口',
  '神庙里',
  '神庙出口',
];

// 更新状态文本
function updateStatusText(text) {
  statusDiv.textContent = text;
}

// 更新按钮文本
function updateButtonLabel() {
  if (step < steps.length) {
    nextButton.textContent = steps[step];
  } else {
    nextButton.textContent = "完成";
  }
}

// 模拟宝藏地图API
class TreasureMap {
  static getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("在古老的图书馆里找到了第一个线索...");
      }, 1000);
    });
  }

  static decodeAncientScript(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) {
          reject("没有线索可以解码!");
        }
        resolve("解码成功!宝藏在一座古老的神庙中...");
      }, 1500);
    });
  }

  static searchTemple(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random();
        if (random < 0.6) { // 60% 的概率逃入神庙走廊
          resolve("找到了一个神秘的箱子...");
        } else { // 40% 的概率被抓住
          reject("糟糕!遇到了神庙守卫!");
        }
      }, 2000);
    });
  }

  static decipherMechanism() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("解密机关成功，宝箱的锁被打开了！");
      }, 2000);
    });
  }

  static openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("恭喜!你找到了传说中的宝藏!");
      }, 1000);
    });
  }
}

treasureChestImage.addEventListener('click', () => {
  alert(`当前位置: ${mapData[step]}`);
});

/*
function findTreasureWithPromises() {
  TreasureMap.getInitialClue()
    .then(clue => {
      console.log(clue);
      return TreasureMap.decodeAncientScript(clue);
    })
    .then(location => {
      console.log(location);
      return TreasureMap.searchTemple(location);
    })
    .then(box => {
      console.log(box);
      return TreasureMap.openTreasureBox();
    })
    .then(treasure => {
      console.log(treasure);
    })
    .catch(error => {
      console.error("任务失败:", error);
    });
}
*/

/*
async function findTreasureWithPromises() {  
  try {  
    const clue = await TreasureMap.getInitialClue();  
    console.log(clue);  
  
    const location = await TreasureMap.decodeAncientScript(clue);  
    console.log(location);  
  
    const box = await TreasureMap.searchTemple(location);  
    console.log(box);  
  
    const treasure = await TreasureMap.openTreasureBox();  
    console.log(treasure);  
  } catch (error) {  
    console.error("任务失败:", error);  
  }  
}  

findTreasureWithPromises()
*/

document.addEventListener('DOMContentLoaded', () => {
  statusDiv.classList.add('visible');
  nextButton.textContent = '开始';

  TreasureMap.getInitialClue().then(clue => {
    updateStatusText(clue);
    updateButtonLabel();
    nextButton.disabled = false;
    statusDiv.classList.add('visible');
  });
});

async function nextStep() {
  try {
    switch (step) {
      case 0:
        updateStatusText(statusDiv.textContent);
        break;
      case 1:
        const clue = statusDiv.textContent;
        updateStatusText("正在解码古代文字...");
        statusDiv.textContent = await TreasureMap.decodeAncientScript(clue);
        break;
      case 2:
        updateStatusText("正在搜索神庙...");
        const location = statusDiv.textContent;
        statusDiv.textContent = await TreasureMap.searchTemple(location);
        templeSearchAttempts = 0; // 重置搜索尝试次数
        break;
      case 3:
        const lock = statusDiv.textContent;
        updateStatusText("正在解密宝箱机关...");
        statusDiv.textContent = await TreasureMap.decipherMechanism();

        break;
      case 4:
        const box = statusDiv.textContent;
        updateStatusText("正在打开宝箱...");
        statusDiv.textContent = await TreasureMap.openTreasureBox();
        nextButton.disabled = true;
      default:
        return;
    }
    step++;
    updateButtonLabel();
  } catch (error) {
    if (step === 2) { // 特定于搜索神庙的步骤
      templeSearchAttempts++;
      if (templeSearchAttempts >= 3) {
        updateStatusText("多次尝试后，仍然未能避开守卫。寻宝失败。");
        nextButton.disabled = true;
      } else {
        updateStatusText(`糟糕！遇到了神庙守卫！成功逃入神庙走廊！第${templeSearchAttempts + 1}次尝试...`);
        nextButton.textContent = "再次尝试";
        // 保持 step 不变，以便用户可以再次尝试
      }
    } else {
      updateStatusText(`任务失败: ${error}`);
      nextButton.disabled = true;
    }
  }
}

nextButton.addEventListener('click', nextStep);