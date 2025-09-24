<template>
  <div id="app">
    <h1 class="game-title">简易拼图游戏</h1>

    <div class="game-container">
      <div class="game-content">
        <div class="puzzle-section">
          <div class="section-title">拼图区域</div>
          <div class="puzzle-board">
            <div
              v-for="(piece, index) in board"
              :key="index"
              class="puzzle-piece"
              :class="{ 'empty-slot': piece === null }"
              :style="piece !== null ? getPieceStyle(piece) : {}"
              @click="removeFromBoard(index)"
            >
              <span v-if="piece === null">{{ index + 1 }}</span>
            </div>
          </div>
          <div class="message hint-message">
            提示：点击上方图块列表中的图块，它们会按顺序填充到拼图区域
          </div>
        </div>

        <div class="puzzle-section">
          <div class="section-title">图块列表</div>
          <div class="pieces-list">
            <div
              v-for="piece in pieces"
              :key="piece"
              class="list-piece"
              :class="{ 'used-piece': isPieceUsed(piece) }"
              :style="getPieceStyle(piece)"
              @click="addToBoard(piece)"
            ></div>
          </div>
          <div class="original-image">
            <img :src="imageSrc" alt="原图参考">
          </div>
        </div>
      </div>

      <div class="game-controls">
        <a-button type="primary" size="large" @click="checkSolution">提交答案</a-button>
        <a-button size="large" @click="resetGame">重新开始</a-button>
        <a-button size="large" @click="shufflePieces">打乱图块</a-button>
      </div>

      <div class="game-info">
        <div class="score-display" v-if="score !== null">
          得分: {{ score }}/100
        </div>
        <div class="message" :class="{ 'success-message': isCompleted }">
          {{ messageInfo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 游戏状态
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'

const board = ref(Array(9).fill(null)); // 拼图区域，初始为空
const pieces = ref([]); // 图块列表
const usedPieces = ref(new Set()); // 已使用的图块
const score = ref(null); // 得分
const isCompleted = ref(false);
// 是否完成
const messageInfo = ref('请从图块列表中选择图块填充到拼图区域');

// 图片资源
const imageSrc = ref('https://picsum.photos/300/300?random=2');

// 初始化游戏
const initGame = () => {
  // 创建9个图块索引 [0,1,2,3,4,5,6,7,8]
  pieces.value = Array.from({ length: 9 }, (_, i) => i);
  // 打乱顺序
  shuffleArray(pieces.value);
  // 清空拼图区域
  board.value = Array(9).fill(null);
  usedPieces.value = new Set();
  score.value = null;
  isCompleted.value = false;
  messageInfo.value = '请从图块列表中选择图块填充到拼图区域';
};

// 打乱数组顺序
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 打乱图块列表
const shufflePieces = () => {
  shuffleArray(pieces.value);
  message.info('图块顺序已打乱');
};

// 检查图块是否已被使用
const isPieceUsed = (piece) => {
  return usedPieces.value.has(piece);
};

// 添加图块到拼图区域
const addToBoard = (piece) => {
  if (isPieceUsed(piece)) {
    message.warning('这个图块已经被使用了');
    return;
  }

  // 找到第一个空位置
  const emptyIndex = board.value.findIndex(slot => slot === null);
  if (emptyIndex === -1) {
    message.warning('拼图区域已满，请先移除一些图块');
    return;
  }

  // 将图块添加到拼图区域
  board.value[emptyIndex] = piece;
  usedPieces.value.add(piece);
  messageInfo.value = `已将图块放置到位置 ${emptyIndex + 1}`;
};

// 从拼图区域移除图块
const removeFromBoard = (index) => {
  const piece = board.value[index];
  if (piece === null) {
    message.warning('这个位置是空的');
    return;
  }

  // 移除图块
  board.value[index] = null;
  usedPieces.value.delete(piece);
  messageInfo.value = `已从位置 ${index + 1} 移除图块`;
};

// 检查答案并评分
const checkSolution = () => {
  // 检查是否所有位置都已填充
  if (board.value.some(slot => slot === null)) {
    message.warning('请先填满所有拼图位置');
    return;
  }

  // 计算得分（每个正确位置得11分，最后一个位置得12分，总共100分）
  let correctCount = 0;
  for (let i = 0; i < 9; i++) {
    if (board.value[i] === i) {
      correctCount++;
    }
  }

  score.value = Math.round((correctCount / 9) * 100);
  isCompleted.value = true;

  if (score.value === 100) {
    messageInfo.value = '太棒了！完美拼图！';
    message.success('恭喜！完美拼图！');
  } else if (score.value >= 80) {
    messageInfo.value = '做得很好！几乎完美！';
    message.success('做得很好！几乎完美！');
  } else if (score.value >= 60) {
    messageInfo.value = '不错！继续努力！';
    message.info('不错！继续努力！');
  } else {
    messageInfo.value = '再接再厉，多练习几次会更好！';
    message.info('再接再厉，多练习几次会更好！');
  }
};

// 重置游戏
const resetGame = () => {
  initGame();
  message.success('游戏已重置');
};

// 获取图块样式（背景位置）
const getPieceStyle = (piece) => {
  const row = Math.floor(piece / 3);
  const col = piece % 3;

  return {
    backgroundImage: `url(${imageSrc.value})`,
    backgroundPosition: `-${col * 100}% -${row * 100}%`,
    backgroundSize: '300% 300%'
  };
};

// 组件挂载后初始化游戏
onMounted(() => {
  initGame();
});
</script>

<style>

.game-title {
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
  font-size: 28px;
  font-weight: 600;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.game-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  width: 100%;
}

.puzzle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.puzzle-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 300px;
  height: 300px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.puzzle-piece {
  width: 100%;
  height: 100%;
  background-size: 300px 300px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.2);
}

.puzzle-piece:hover {
  transform: scale(1.03);
  z-index: 1;
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.4);
}

.empty-slot {
  background-color: #f0f2f5;
  border: 2px dashed #d9d9d9;
  cursor: default;
}

.empty-slot:hover {
  transform: none;
  box-shadow: none;
}

.pieces-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 300px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
}

.list-piece {
  width: 90px;
  height: 90px;
  background-size: 270px 270px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.list-piece:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.used-piece {
  opacity: 0.4;
  cursor: not-allowed;
}

.used-piece:hover {
  transform: none;
  box-shadow: none;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.game-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.score-display {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  color: white;
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.message {
  text-align: center;
  font-size: 16px;
  min-height: 24px;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  max-width: 400px;
}

.success-message {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  font-weight: bold;
}

.hint-message {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.original-image {
  width: 200px;
  height: 200px;
  border: 2px solid #1890ff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.original-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .game-content {
    flex-direction: column;
    align-items: center;
  }

  .game-controls {
    flex-direction: column;
    align-items: center;
  }
}
</style>
