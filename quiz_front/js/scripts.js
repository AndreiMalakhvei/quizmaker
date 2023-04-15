import {getQuizRequest, postFormRequest} from './jsfolder/httprequests.js'
import renderResults from "./jsfolder/renderResultsBlock.js";
import getQuizzes from "./jsfolder/startMain.js"


const quizForm = document.getElementById('inputForm')
const quiz = document.getElementById('quiz')
const quizQuestions = document.getElementById('quiz-questions')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const quizFormDiv = document.getElementById('quiz-complete-form')
const quizList = document.getElementById('quiz-list')

let localResults = {}
let dataLength = 0
let dataSet = {}
let QuizzIDV = 0
let quizzOwner = 0


const renderIndicator = (quizStep, data) => {
    quizIndicator.innerHTML = `${quizStep}/${dataLength}`
}


const renderQuestion = (index, data) => {
    renderIndicator(index + 1, data)
    quizQuestions.dataset.currentStep = index
    btnNext.style.visibility = 'visible'
    btnNext.disabled = true

    const renderAnswers = () =>
        data[index]
            .to_question
            .map((answer) =>
            `<li>
                <label>
                    <input class="answer-input" type="radio" name="${data[index].id}" value="${answer.id}">
                    ${answer.content}
                </label>
            </li>`
            )
            .join('')

    quizQuestions.innerHTML = `
    <div class="quiz-question-item">
        <div class="quiz-question-item-qestion">${data[index].content}</div>
        <ul class="quiz-question-item-answer">${renderAnswers()}</ul>
    </div>
    `
}


const getData = (quizzID) => {
    QuizzIDV = quizzID

    getQuizRequest(quizzID)
        .then(responseData => {
            if (responseData) {
                dataLength = responseData.length
                dataSet = responseData
                renderQuestion(0, dataSet)
            } else {
                quizQuestions.innerHTML = `
                <div class="quiz-question-item">
                    <div class="quiz-question-item-qestion">
                    <p>Вопросы не найдены...</p>
                    </div>        
                </div>    `
            }
        });
};

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
            btnNext.style.visibility = 'hidden'
            quizFormDiv.classList.remove('form--hidden')
            quizResult.style.visibility = 'visible'
            btnRestart.style.visibility = 'visible'
            renderResults(dataSet, quizzOwner, dataSet, localResults)
        } else {
            renderQuestion(nextQuestionIndex, dataSet)
        }
    } else if (event.target.classList.contains('btn-restart')) {
        localResults = {}
        quizResult.innerHTML = ''
        quizQuestions.classList.remove('questions--hidden')
        quizIndicator.classList.remove('quiz--hidden')
        btnNext.style.visibility = 'visible'
        quizResult.style.visibility = 'hidden'
        btnRestart.style.visibility = 'hidden'
        quizFormDiv.classList.add('form--hidden')
        renderQuestion(0, dataSet)
    }
})

quizForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let nameVar = ''
    let phoneVar = ''
    let mailVar = ''
    if (quizForm.elements.nameInput) {nameVar = quizForm.elements.nameInput.value}
    if (quizForm.elements.mailInput) {mailVar = quizForm.elements.mailInput.value}
    if (quizForm.elements.phoneInput) {phoneVar = quizForm.elements.phoneInput.value}

    const postData = {
        quiz: QuizzIDV,
        name: nameVar,
        email: mailVar,
        phone: phoneVar,
        result: localResults
    }

    postFormRequest(postData)
        .then(
            actions => {
                quizResult.style.visibility = 'hidden'
                btnRestart.style.visibility = 'hidden'
                quizFormDiv.classList.add('form--hidden')
                quizList.classList.remove('quiz-list-hidden')
            }
        )
})

quizList.addEventListener('click', (event) => {
    event.preventDefault()
    if (event.target.className === 'quiz-link') {
        quizzOwner = event.target.rel
        getData(event.target.id)
        quizList.classList.add('quiz-list-hidden')
    }
})

getQuizzes()
