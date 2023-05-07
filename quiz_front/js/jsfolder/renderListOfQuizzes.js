const quizList = document.getElementById('quiz-list')

const renderQuizzList = (data) => {
    let result = '<p class="list-title"> Доступные квизы </p>'
    data.map(
        (quiz) => result += `<li class="quiz-name"> <a href="" rel="${quiz.owner}" class = "quiz-link" id="${quiz.id}" > ${quiz.name} </a> </li>`
    ).join('')

    quizList.innerHTML = `
    <ul class="quiz-list-ulist">
    ${result} 
    </ul>
    `
}

export default renderQuizzList