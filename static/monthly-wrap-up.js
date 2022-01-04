function submit () {
    const style = document.querySelector('input[name="style"]:checked').value;
    const showIGhandle = document.querySelector('input[name="ig-handle"]').checked;
    const noLowRatings = document.querySelector('input[name="no-low-rating"]').checked;
    const year = document.querySelector('#year').value;
    const month = document.querySelector('#month').value;

    document.querySelector('article').style.display = 'none';
    document.querySelector('#loading').style.display = 'block';

    axios.post('/generate-monthly-wrap-up', {
        style,
        showIGhandle,
        noLowRatings,
        year,
        month
    })
        .then(function ({ data }) {
            data.forEach(url => {
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = true;
                document.body.appendChild(anchor);
                anchor.click();
            });
            
            const h5 = document.createElement('h5');
            h5.appendChild(document.createTextNode('Download is starting...'));
            document.body.appendChild(h5);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(() => {
            document.querySelector('#loading').style.display = 'none';
        });
}

setTimeout(() => {
    document.querySelector('#submit').addEventListener('click', submit);
}, 1000);
