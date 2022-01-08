function submit (event) {
    event.target.parentNode.submit()

    const gr = document.querySelector('input[name="goodreads"]').value.split("/").last.split("-")[0];
    const ig = document.querySelector('input[name="instagram"]').value.split("/")[3];

    localStorage.setItem('goodreads', gr);
    localStorage.setItem('instagram', ig);
}

setTimeout(() => {
    document.querySelector('form .submit-btn').addEventListener('click', submit);
}, 1500);
