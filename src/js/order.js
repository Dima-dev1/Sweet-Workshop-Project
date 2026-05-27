
import iziToast from "izitoast"
import { createOrder } from "./services/api/createOrder"

import "izitoast/dist/css/iziToast.min.css";

const btnExit = document.querySelector('.btn-exit')
const modalOverlay = document.querySelector('.modal-overlay')
const form = document.querySelector('.form-order')
const formElements = form.querySelectorAll('input, textarea')

export function openModal(id) {
    modalOverlay.classList.add('is-open')
    document.body.classList.add('no-scroll')
    form.dataset.id = id
    
}

function closeModal() {
    modalOverlay.classList.remove('is-open')
  document.body.classList.remove('no-scroll')
  form.reset()
  formElements.forEach(el => {
    el.nextElementSibling.hidden = true 
    el.classList.remove('error')
  }
) 
}

modalOverlay.addEventListener('click', hundleClick)
document.addEventListener('keydown', hundleKey)
form.addEventListener('submit', hundleSubmit)
form.addEventListener('input', hideError)


function hundleClick(e) {
    if (e.target.closest('.btn-exit') || e.target === btnExit || e.target === modalOverlay) {
        closeModal()
    }
}

function hundleKey(event) {
    if (event.key !== "Escape") {
        return
    }
    closeModal()
    
}

  function hideError(ev) {
        
    ev.target.classList.remove('error')
    if (ev.target.nextElementSibling) {
        ev.target.nextElementSibling.hidden = true // <-- додай
    }
}
async function hundleSubmit(event) {
    event.preventDefault()
    const inpuName = event.target.elements['user-name']
    const inpuPhone = event.target.elements['user-tel']
    const textarea = event.target.elements.comment
    const userName = inpuName.value
    const userTel = inpuPhone.value
    const comment = textarea.value

    let hasError = false

    if (!userName.trim()) {
          inpuName.nextElementSibling.hidden = false
        inpuName.classList.add('error')
        hasError = true
    }
    
    const validPhone = userTel.replace(/\D/g, '')
    if (validPhone.length !== 12) {
        inpuPhone.nextElementSibling.hidden = false
        inpuPhone.classList.add('error')
        hasError = true
    }
    if (!comment.trim()) {
        textarea.nextElementSibling.hidden = false
        textarea.classList.add('error')
        hasError = true
    }
      
    if (hasError) {
        return
    }
  

    const formData = {
        name: userName,
        phone: validPhone,
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
