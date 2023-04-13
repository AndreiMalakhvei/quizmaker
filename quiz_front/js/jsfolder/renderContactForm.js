import {renderFormRequest} from "./httprequests.js";

const quizForm = document.getElementById('inputForm')



const renderForm = (owner) => {
    let markdown = ``
    console.log("entered renderForm")

       renderFormRequest(owner)
        .then(responseData => {

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

export default renderForm