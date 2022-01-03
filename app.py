import os

import flask
from flask import Flask, session, request

app = Flask(__name__)
app.secret_key = 'malysh'

if os.environ.get('HEROKU'):
    from utils import (
        build_html_page,
        parse_monthly_books,
        build_gr_read_shelf_url,
        generate_screenshots
    )
else:
    from .utils import (
        build_html_page,
        parse_monthly_books,
        build_gr_read_shelf_url,
        generate_screenshots
    )


@app.route('/')
def home():
    if not session:
        return flask.redirect(flask.url_for('setup'))
    return flask.render_template('index.html', session=session['user'])


@app.route('/setup')
def setup():
    return flask.render_template('setup.html')


@app.route('/setup-accounts', methods=['post'])
def setup_accounts():
    goodreads = request.form.get('goodreads')  # access the data inside 
    instagram = request.form.get('instagram')
    session['user'] = {
        'goodreads': goodreads.split('/')[-1].split('-')[0],
        'instagram': instagram.split('/')[-2]
    }
    return flask.redirect(flask.url_for('home'))


@app.route('/monthly-wrap-up')
def monthly_wrap_up():
    if not session:
        flask.redirect(flask.url_for('setup'))
    return flask.render_template('monthly-wrap-up.html', session=session['user'])


@app.route('/generate-monthly-wrap-up', methods=['get', 'post'])
def generate_monthly_wrap_up():
    build_html_page(
        parse_monthly_books(build_gr_read_shelf_url(session['user']['goodreads']), 2022, 1, request.json.get('noLowRatings', False)),
        2022,
        1,
        request.json.get('style', 'elegant'),
        session['user']['instagram'],
        request.json.get('showIGhandle', False)
    )
    return flask.jsonify(generate_screenshots(2022, 1, session['user']['instagram']))


@app.route('/downloads/<path:filename>', methods=['GET'])
def download(filename):
    full_path = os.path.join(app.root_path, 'downloads')
    return flask.send_from_directory(full_path, filename)