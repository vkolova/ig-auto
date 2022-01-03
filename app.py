import os

import flask
from flask import Flask, session, request

app = Flask(__name__)
app.secret_key = 'malysh'

if os.environ['HEROKU']:
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

    # build_html_page(parse_monthly_books(build_gr_read_shelf_url(session['user']['goodreads']), 2021, 12), 2021, 12, 'elegant', session['user']['instagram'])
    # generate_screenshots(2021, 12, session['user']['instagram'])

    return flask.render_template('monthly-wrap-up.html', session=session['user'])
