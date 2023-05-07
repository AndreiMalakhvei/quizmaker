import {renderFormRequest} from "./httprequests.js";

const quizForm = document.getElementById('inputForm')



const renderForm = (owner) => {
    let markdown = ``

    function checkVisibility (criteria) {
        if (criteria) {
            return 'mb-3'
        } else {
            return 'input-unvisible'
        }
    }

    function checkRequired (criteria) {
        if (criteria) {
            return 'required'
        }
    }


       renderFormRequest(owner)
        .then(responseData => {
            $(function () {
        $("#phoneInput").mask("+375(99)999-99-99");
        $("#phoneInput").on('change', function() {
            let phoneInput = document.getElementById('phoneInput')
            let toCheck = $(this).val()
            let nameRGEX = /^\+375\([0-9]{2}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
            let checkResult = nameRGEX.test(toCheck);
            console.log(checkResult)
            if (!checkResult) {
                phoneInput.classList.remove('good-input')
                phoneInput.classList.add('wrong-input')}
            else {
                phoneInput.classList.remove('wrong-input')
                phoneInput.classList.add('good-input')
            }

            })

            });

            quizForm.innerHTML = `
    
    <div class="${checkVisibility(responseData.define_name)}">    
    <label for="nameControl">First name: </label>
        <input class="form-input" type="text" name="nameControl" id="nameInput"  ${checkRequired(responseData.define_name)}>
    </div>
   
    
    <div class="${checkVisibility(responseData.define_email)}">        
      <label for="nameMail" class="form-label">Email address</label>
      <input type="email" class="form-input"  name="nameMail" id="mailInput"  ${checkRequired(responseData.define_email)}>
    </div>
    
    
    <div class="${checkVisibility(responseData.define_phone)}">
      <label for="namePhone" class="form-label">Phone number</label>
      <input class="form-input" name="namePhone" id="phoneInput" ${checkRequired(responseData.define_phone)}>
    </div>
    
    <input type="submit" value="Отправить результаты" class="btn btn-primary">


    `
    if (responseData.define_email) {
        let mailInput = document.getElementById('mailInput')
        mailInput.addEventListener('input', (event) => {

            let toCheck = event.target.value;
            let phoneRGEX = /^[a-zA-Zа-яА-ЯёЁ0-9_-]+@[a-zA-Zа-яА-ЯёЁ0-9]+\.[a-zA-Zа-яА-ЯёЁ]+$/;
            let checkResult = phoneRGEX.test(toCheck);
            if (!checkResult) {
                mailInput.classList.remove('good-input')
                mailInput.classList.add('wrong-input')}
            else {
                mailInput.classList.remove('wrong-input')
                mailInput.classList.add('good-input')
            }
        }  )
    }


    if (responseData.define_name) {
        let nameInput = document.getElementById('nameInput')
        nameInput.addEventListener('input', (event) => {

            let toCheck = event.target.value;
            let nameRGEX = /^[a-zA-Zа-яА-ЯёЁ]{1,20}$/;
            let checkResult = nameRGEX.test(toCheck);
            if (!checkResult) {
                nameInput.classList.remove('good-input')
                nameInput.classList.add('wrong-input')}
            else {
                nameInput.classList.remove('wrong-input')
                nameInput.classList.add('good-input')
            }
        }  )
    }




            })}

export default renderForm
