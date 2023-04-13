const URL = "http://127.0.0.1:8000/api/v1/"

export async function getQuizzesRequest () {
	    const response = await fetch(`${URL}quizzes/`)
        return response.json()
}

export async function getQuizRequest (id) {
	    const response = await fetch(`${URL}quizz/${id}`)
        return response.json()
    }

export async function renderFormRequest (owner) {
        console.log("starting request")
	    const response = await fetch(`${URL}completed/${owner}`)
        return response.json()
    }
