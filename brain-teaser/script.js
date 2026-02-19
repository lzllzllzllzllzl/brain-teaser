let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

// 加载题库
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();
    questions = data.questions;
    // 打乱题目顺序
    questions = shuffleArray(questions);
    document.getElementById('total').textContent = questions.length;
    loadQuestion();
  } catch (error) {
    console.error('加载题库失败:', error);
    document.getElementById('question').textContent = '题库加载失败，请刷新页面';
  }
}

// 洗牌算法
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 加载当前题目
function loadQuestion() {
  answered = false;
  const question = questions[currentIndex];
  document.getElementById('question').textContent = question.question;
  document.getElementById('current').textContent = currentIndex + 1;
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').disabled = false;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('correct-answer').textContent = '';
  document.getElementById('correct-answer').classList.remove('show');
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('next-btn').disabled = true;
  document.getElementById('show-answer-btn').disabled = false;
  document.getElementById('answer-input').focus();
}

// 检查答案
function checkAnswer() {
  if (answered) return;

  const userInput = document.getElementById('answer-input').value.trim().toLowerCase();
  const correctAnswer = questions[currentIndex].answer.toLowerCase();

  if (!userInput) {
    document.getElementById('feedback').textContent = '⚠️ 请输入答案！';
    document.getElementById('feedback').className = 'feedback wrong';
    return;
  }

  answered = true;
  const isCorrect = userInput === correctAnswer || correctAnswer.includes(userInput) || userInput.includes(correctAnswer);

  if (isCorrect) {
    score += 10;
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').textContent = '✅ 回答正确！';
    document.getElementById('feedback').className = 'feedback correct';
  } else {
    document.getElementById('feedback').textContent = '❌ 回答错误！';
    document.getElementById('feedback').className = 'feedback wrong';
    document.getElementById('correct-answer').textContent = `💡 正确答案：${questions[currentIndex].answer}`;
    document.getElementById('correct-answer').classList.add('show');
  }

  document.getElementById('answer-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('show-answer-btn').disabled = true;
  document.getElementById('next-btn').disabled = false;

  // 检查是否完成所有题目
  if (currentIndex >= questions.length - 1) {
    document.getElementById('next-btn').textContent = '查看结果';
  }
}

// 下一题
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    document.getElementById('next-btn').textContent = '下一题';
    loadQuestion();
  } else {
    // 游戏结束
    showResult();
  }
}

// 显示结果
function showResult() {
  const percentage = Math.round((score / (questions.length * 10)) * 100);
  let message = '';

  if (percentage >= 80) {
    message = '🏆 太棒了！你是脑筋急转弯大师！';
  } else if (percentage >= 60) {
    message = '👍 不错哦！继续加油！';
  } else if (percentage >= 40) {
    message = '📚 还需要多练习哦！';
  } else {
    message = '💪 再接再厉！';
  }

  document.querySelector('.game-area').innerHTML = `
    <div class="question-card" style="text-align: center;">
      <h2>🎉 游戏结束</h2>
      <p style="font-size: 1.5rem; margin: 20px 0;">最终得分：<strong style="color: #667eea;">${score}</strong> / ${questions.length * 10}</p>
      <p style="font-size: 1.2rem; margin: 20px 0;">正确率：<strong style="color: #667eea;">${percentage}%</strong></p>
      <p style="font-size: 1.3rem; margin: 20px 0; color: #667eea;">${message}</p>
    </div>
    <div class="controls">
      <button id="restart-btn" style="background: #667eea; color: white;">再玩一次</button>
    </div>
  `;

  document.getElementById('restart-btn').addEventListener('click', restartGame);
}

// 显示答案
function showAnswer() {
  if (answered) return;
  document.getElementById('correct-answer').textContent = `💡 答案：${questions[currentIndex].answer}`;
  document.getElementById('correct-answer').classList.add('show');
  document.getElementById('show-answer-btn').disabled = true;
}

// 重新开始
function restartGame() {
  currentIndex = 0;
  score = 0;
  answered = false;
  document.getElementById('score').textContent = '0';

  // 重新加载游戏区域
  document.querySelector('.game-area').innerHTML = `
    <div class="score-board">
      <span>得分：<strong id="score">0</strong></span>
      <span>题目：<strong id="current">1</strong>/<strong id="total">${questions.length}</strong></span>
    </div>

    <div class="question-card">
      <div class="question-text" id="question"></div>
      <div class="answer-area">
        <input type="text" id="answer-input" placeholder="输入你的答案..." autocomplete="off">
        <button id="submit-btn">提交答案</button>
        <button id="show-answer-btn" class="secondary">查看答案</button>
      </div>
      <div class="feedback" id="feedback"></div>
      <div class="correct-answer" id="correct-answer"></div>
    </div>

    <div class="controls">
      <button id="next-btn" disabled>下一题</button>
      <button id="restart-btn" class="secondary">重新开始</button>
    </div>
  `;

  // 重新绑定事件
  document.getElementById('submit-btn').addEventListener('click', checkAnswer);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('restart-btn').addEventListener('click', restartGame);
  document.getElementById('show-answer-btn').addEventListener('click', showAnswer);
  document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });

  loadQuestion();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();

  document.getElementById('submit-btn').addEventListener('click', checkAnswer);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('restart-btn').addEventListener('click', restartGame);
  document.getElementById('show-answer-btn').addEventListener('click', showAnswer);

  document.getElementById('answer-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
});
