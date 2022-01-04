Object.defineProperty(Array.prototype, 'last', {
    get : function() {
        return this[this.length - 1];
    }
});

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
            const container = document.createElement('article');
            container.classList = 'download-links';
            const h4 = document.createElement('h4');
            h4.appendChild(document.createTextNode('Download links'));

            container.appendChild(document.createElement('br'));
            container.appendChild(document.createElement('br'));
            container.appendChild(document.createElement('br'));

            container.appendChild(h4);

            container.appendChild(document.createElement('br'));


            data.forEach(url => {
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = true;
                anchor.appendChild(document.createTextNode(url.split('/').last));
                container.appendChild(anchor);
                container.appendChild(document.createElement('br'));
                container.appendChild(document.createElement('br'));
            });
            document.body.appendChild(container);
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
