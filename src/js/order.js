
import iziToast from "izitoast"
import { createOrder } from "./services/api/createOrder"

import "izitoast/dist/css/iziToast.min.css";

const btnExit = document.querySelector('.btn-exit')
const modalOverlay = document.querySelector('.modal-overlay')
const form = document.querySelector('.form-order')


function openModal(id) {
    modalOverlay.classList.add('is-open')
    document.body.classList.add('no-scroll')
    form.dataset.id = id
    
}
function closeModal() {
    modalOverlay.classList.remove('is-open')
    document.body.classList.remove('no-scroll')
}

modalOverlay.addEventListener('click', hundleClick)
document.addEventListener('keydown', hundleKey)
form.addEventListener('submit', hundleSubmit)

openModal(`6852a9fcb459460cb6b47720`)

function hundleClick(e) {
    if (e.target === btnExit || e.target === modalOverlay) {
        closeModal()
    }
}

function hundleKey(event) {
    if (event.key !== "Escape") {
        return
    }
    closeModal()
    
}

async function hundleSubmit(event) {
    event.preventDefault()
    const userName = event.target.elements['user-name'].value
    const userTel = event.target.elements['user-tel'].value
    const comment = event.target.elements.comment.value

    const formData = {
        name: userName,
  phone: userTel,
  dessertId: form.dataset.id,
  comment: comment,
    }

    try {
        const response = await createOrder(formData)
        console.log(response);

        iziToast.show({
            message: 'Ваше замовлення успішно відправлено!',
            color: 'green',
            position: 'topRight'
        })
        event.target.reset()
       closeModal()
       
    } catch (error) {
        form.classList.add('error')
        iziToast.show({
            message: 'Введіть коректні дані!',
            color: 'red',
            position: 'topRight'
        })   
    }
}
