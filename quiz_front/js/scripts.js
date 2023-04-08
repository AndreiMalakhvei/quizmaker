import testing from './jsfolder/testscript.js'
const quiz = document.getElementById('quiz')
const quizQuestions = document.getElementById('quiz-questions')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const quizFormDiv = document.getElementById('quiz-complete-form')
const quizForm = document.getElementById('inputForm')
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
                `
            <li>
                <label>
                    <input class="answer-input" type="radio" name="${data[index].id}" value="${answer.id}">
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


const getData = (quizzID,) => {
    QuizzIDV = quizzID

    fetch(`http://127.0.0.1:8000/api/v1/quizz/${quizzID}`)
        .then(
            response => {
                return response.json();
            }
        )
        .then(responseData => {
            console.log(responseData)
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
            .map((answer) => `<li class="${checkIsCorrect(answer, data[index].id)}">${answer.content}</li>`)
            .join('')

    data.forEach((question, index) => {
        result += `
        <div class="quiz-result-item">
            <div class="quiz-result-item-qestion">${question.content}</div>
            <ul class="quiz-result-item-answer">${getAnswers(index, dataSet)}</ul>
        </div>
        `
    })
    console.log(data)
    renderForm(quizzOwner)
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
            btnNext.style.visibility = 'hidden'
            quizFormDiv.classList.remove('form--hidden')

            quizResult.style.visibility = 'visible'
            btnRestart.style.visibility = 'visible'


            renderResults(dataSet)
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


const renderForm = (owner) => {
    let markdown = ``

       fetch(`http://127.0.0.1:8000/api/v1/completed/${owner}`)
        .then(
            response => {
                return response.json();
            }
        )
        .then(responseData => {
            console.log(responseData)

            if (responseData.define_name) {
                markdown +=
                    `<div class="mb-3">
    <label for="nameControl">First name: </label>
        <input class="form-control" type="text" name="nameControl" id="nameInput"  required>
    </div>`
            }


            if (responseData.define_email) {
                markdown +=
                    `<div class="mb-3">        
      <label for="nameMail" class="form-label">Email address</label>
      <input type="email" class="form-control"  name="nameMail" id="mailInput" placeholder="name@example.com" required>
    </div>`
            }

       if (responseData.define_phone) {
                markdown +=
                    `<div class="mb-3">
      <label for="namePhone" class="form-label">Phone number</label>
      <input class="form-control" name="namePhone" id="phoneInput" >
    </div>`
            }


       if (responseData.define_name || responseData.define_phone || responseData.define_email) {
                markdown +=
                    `<input type="submit" value="Отправить результаты" class="btn btn-primary">`
            }
            quizForm.innerHTML = markdown

        })}

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


    fetch('http://127.0.0.1:8000/api/v1/quizzresult/', {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json"
    },

    })
        .then(
            response => {
                quizResult.style.visibility = 'hidden'
                btnRestart.style.visibility = 'hidden'
                quizFormDiv.classList.add('form--hidden')
                quizList.classList.remove('quiz-list-hidden')
                return response.json();
            }
        )
})



const getQuizzes = () => {
    fetch('http://127.0.0.1:8000/api/v1/quizzes/')
        .then(
            response => {
                return response.json();
            }
        )
        .then(responseData => {

            if (responseData) {

                renderQuizzList(responseData)
            } else {
                quizList.innerHTML = `
                <div class="quiz-question-item">
                    <div class="quiz-question-item-qestion">
                    <p>Квизы не найдены...</p>
                    </div>        
                </div>
    `
            }
        });
}



const renderQuizzList = (data) => {
    let result = 'Доступные квизы'

    data.map(
        (quiz) => result += `<li class="quiz-name"> <a href="" rel="${quiz.owner}" class = "quiz-link" id="${quiz.id}" > ${quiz.name} </a> </li>`
    ).join('')

    quizList.innerHTML = `
    <ul class="quiz-list_list">
    ${result} 
    </ul>
    `
}

quizList.addEventListener('click', (event) => {
    event.preventDefault()


    if (event.target.className === 'quiz-link') {
        quizzOwner = event.target.rel

        getData(event.target.id)

        quizList.classList.add('quiz-list-hidden')
    }

})




getQuizzes()
testing()


