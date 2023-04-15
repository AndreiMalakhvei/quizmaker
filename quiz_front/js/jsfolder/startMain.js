import {getQuizzesRequest} from "./httprequests.js";
import renderQuizzList from "./renderListOfQuizzes.js";

const quizList = document.getElementById('quiz-list')

const getQuizzes = () => {
    getQuizzesRequest().then(responseData => {
            if (responseData) {
                renderQuizzList(responseData)
            } else {
                quizList.innerHTML = `
                <div class="quiz-question-item">
                    <div class="quiz-question-item-qestion">
                    <p>Квизы не найдены...</p>
                    </div>        
                </div>    `
            }
        });
}

export default getQuizzes