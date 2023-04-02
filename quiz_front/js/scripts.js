const quiz = document.getElementById('quiz')
const quizQuestions = document.getElementById('quiz-questions')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')

let localResults = {}
let dataLength = 0
let dataSet = {}

const renderIndicator = (quizStep, data) => {
    quizIndicator.innerHTML = `${quizStep}/${dataLength}`
}


const renderQuestion = (index, data) => {
    renderIndicator(index + 1, data)
    quizQuestions.dataset.currentStep = index
    btnNext.disabled = true

    const renderAnswers = () =>
        data[index]
            .to_question
            .map((answer) =>
                `
            <li>
                <label>
                    <input class="answer-input" type="radio" name="${index}" value="${answer.id}">
                    ${answer.content}
                </label>
            </li>
            `
            )
            .join('')

    quizQuestions.innerHTML = `
    <div class="quiz-question-item">
        <div class="quiz-question-item-qestion">${data[index].content}</div>
        <ul class="quiz-question-item-answer">${renderAnswers()}</ul>
    </div>
    `
}


const getData = () => {
    fetch('http://127.0.0.1:8000/api/v1/quizz/6')
        .then(
            response => {return response.json();}
        )
        .then( responseData => {
            console.log(responseData)
            if (responseData){
                dataLength = responseData.length
                dataSet = responseData
                renderQuestion(0, dataSet)
            }
            else {
                quizQuestions.innerHTML = `
                <div class="quiz-question-item">
                    <div class="quiz-question-item-qestion">
                    <p>Вопросы не найдены...</p>
                    </div>        
                </div>
    `
            }
        });
};

const renderResults = (data) => {
    let result = 'Результаты теста:'

    const checkIsCorrect = (answer, index) => {
        let className = ''

        if (!answer.is_correct && answer.id.toString() === localResults[index]) {
            className = 'answer-invalid'
        } else if (answer.is_correct) {
            className = 'answer-valid'
        }

        return className
    }

    const getAnswers = (index, data) =>
        data[index]
            .to_question
            .map((answer) => `<li class="${checkIsCorrect(answer, index)}">${answer.content}</li>`)
            .join('')

    data.forEach((question, index) => {
        result += `
        <div class="quiz-result-item">
            <div class="quiz-result-item-qestion">${question.content}</div>
            <ul class="quiz-result-item-answer">${getAnswers(index, dataSet)}</ul>
        </div>
        `
    })

    quizResult.innerHTML = result
}



quiz.addEventListener('change', (event) => {
    if (event.target.classList.contains('answer-input')) {
        localResults[event.target.name] = event.target.value
        btnNext.disabled = false
    }
})

quiz.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-next')) {
        const nextQuestionIndex = Number(quizQuestions.dataset.currentStep) + 1
        if (nextQuestionIndex === dataLength) {
            quizQuestions.classList.add('questions--hidden')
            quizIndicator.classList.add('quiz--hidden')
            btnNext.style.visibility='hidden'

            quizResult.style.visibility='visible'
            btnRestart.style.visibility='visible'

            renderResults(dataSet)
        } else {
            renderQuestion(nextQuestionIndex, dataSet)
        }
    } else if (event.target.classList.contains('btn-restart')) {
        localResults = {}
        quizResult.innerHTML = ''

        quizQuestions.classList.remove('questions--hidden')
        quizIndicator.classList.remove('quiz--hidden')
        btnNext.style.visibility='visible'
        quizResult.style.visibility='hidden'
        btnRestart.style.visibility='hidden'

        renderQuestion(0, dataSet)
    }
})







getData()





