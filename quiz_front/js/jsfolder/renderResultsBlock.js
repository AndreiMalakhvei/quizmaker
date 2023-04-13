import renderForm from "./renderContactForm.js";

const quizResult = document.getElementById('quiz-results')

const renderResults = (data, quizzOwner, dataSet, localResults) => {
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

    renderForm(quizzOwner)
    quizResult.innerHTML = result
}

export default renderResults