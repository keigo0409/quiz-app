`use strict`;

//0.基本データ
//地理のクイズデータ
const data = [
    {
        quetion: "日本で一番面積の大きい都道府県は？",
        answers: ["青森県", "東京都", "北海道", "福岡県"],
        correct: "青森県"
    },
    {
        quetion: "日本で一番人口の多い都道府県は？",
        answers: ["福岡県", "青森県", "東京都", "長野県"],
        correct: "青森県"
    },
    {
        quetion: "日本で一番人口密度の高い都道府県は？",
        answers: ["東京都", "茨城県", "福島県", "青森県"],
        correct: "青森県"
    }
]

// 出題する問題数
const QUESTION_LENGTH = 3;

const ANSWERS_TIME_MS = 10000;

const INTERVAL_TIME_MS = 10;


//出題する問題データ
// let questions = data.slice(0, QUESTION_LENGTH);
let questions = getRandamQuestions();
// 出題する問題のインデックス
let questionIndex = 0;
//正解数
let correctCount = 0;
// インターバルID
let intervalId = null;
// 解答中の経過時間
let elapsedTime = 0;

let startTime = null;

//1.要素一覧

const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");

const startButton = document.getElementById("startButton");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#questionPage button");

const resultMessage = document.getElementById("resultMessage");
const backButton = document.getElementById("backButton");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");


const questionProgress = document.getElementById("questionProgress");




//2.処理


startButton.addEventListener("click", clickstartButton);

optionButtons.forEach((button) => {
    button.addEventListener("click", clickOptionButton);
});

nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click", clickbackButton);


//関数一覧

function questionTimeOver() {
    questionResult.innerText = "✖";
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }

    dialog.showModal();
}

function startProgress() {
    startTime = Date.now();
    intervalId = setInterval(() => {
        const currentTime = Date.now();
        const progress = ((currentTime - startTime) / ANSWERS_TIME_MS) * 100;
        questionProgress.value = progress;
        if (startTime + ANSWERS_TIME_MS <= currentTime) {
            stopProgress();
            questionTimeOver();
            return;
        }
    }, INTERVAL_TIME_MS)
}

function stopProgress() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }

}

function reset() {
    // 出題する問題をランダムに取得する
    questions = getRandamQuestions();
    // 出題する問題のインデックスを初期化する
    questionIndex = 0;
    // 正解数を初期化する
    correctCount = 0;
    // インターバルIDを初期化する
    intervalId = null;
    // 解答中の経過時間を初期化する
    elapsedTime = 0;
    // 開始時間を初期化する
    startTime = null;
    // ボタンを有効化する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].removeAttribute("disabled");
    }
}

function isQuestionEnd() {
    //問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRandamQuestions() {
    //出題する問題のインデックスリスト
    const questionIndexList = [];
    while (questionIndexList.length !== QUESTION_LENGTH) {
        //出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        // インデックスに含まれていない場合、インデックスリストに追加する
        if (!questionIndexList.includes(index)) {
            questionIndexList.push(index);
        }
    }
    // 出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList
}

function setResult() {
    //正解率を計算する
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    //正解率を表示する
    resultMessage.innerText = `正解率：${accuracy}%`;
}

function setQuestion() {
    //問題を取得する
    const question = questions[questionIndex];
    //問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex + 1} 問`;
    questionText.innerText = question.quetion;
    //選択肢を表示する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerText = question.answers[i];
    }
}

//3.イベント関連の関数一覧
function clickOptionButton(event) {
    // 解答中の経過時間を停止する
    stopProgress();
    optionButtons.forEach((button) => {
        button.disabled = true;
    }
    );
    let a = document.getElementById("a");
    a.innerText = "";
    //解答処理を実施する
    const optionText = event.target.innerText;
    //正解のテキストを取得する

    const correctText = questions[questionIndex].correct;
    if (optionText === correctText) {
        correctCount++;
        questionResult.innerText = "⭕";
    } else {
        a.innerText = `正解は${correctText}でした！`;
        questionResult.innerText = "✖";
    }
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }
    // dialog.showModal();
    dialog.showModal();
}


function clickstartButton() {
    // クイズをリセットする
    reset();
    //問題画面に問題を設定する
    setQuestion();
    // 解答の計測を開始する
    startProgress();
    //スタート画面を非表示にする
    startPage.classList.add("hidden");
    //問題画面を表示する
    questionPage.classList.remove("hidden");
    //結果画面を非表示にする
    resultPage.classList.add("hidden");
}

function clickNextButton() {
    if (isQuestionEnd()) {
        // 正解率を設定する
        setResult();
        // ダイアログを閉じる
        dialog.close();
        //スタート画面を非表示にする
        startPage.classList.add("hidden");
        //問題画面を表示する
        questionPage.classList.add("hidden");
        //結果画面を非表示にする
        resultPage.classList.remove("hidden");
    } else {
        questionIndex++;
        setQuestion();

        intervalId = null;

        elapsedTime = 0;
        for (let i = 0; i < optionButtons.length; i++) {
            optionButtons[i].removeAttribute("disabled");
        }
        dialog.close();
        startProgress();
    }
}

function clickbackButton() {
    // スタート画面を表示する
    startPage.classList.remove("hidden");
    // 問題画面を非表示にする
    questionPage.classList.add("hidden");
    // 結果画面を非表示にする
    resultPage.classList.add("hidden");
}
