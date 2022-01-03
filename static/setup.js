function submit (event) {
    event.target.parentNode.submit()
}

setTimeout(() => {
    document.querySelector('form .submit-btn').addEventListener('click', submit);
}, 1500);
