import os
from datetime import timedelta

import flask
from flask import Flask, session, request
import requests_cache

app = Flask(__name__)
app.secret_key = 'malysh'
app.permanent_session_lifetime = timedelta(minutes=5)

if os.environ.get('HEROKU', __name__ == '__main__'):
    from utils import (
        build_html_page,
        parse_monthly_books,
        build_gr_read_shelf_url,
        generate_screenshots
    )
    from parser import get_current_read
else:
    app.debug = True

    from .utils import (
        build_html_page,
        parse_monthly_books,
        build_gr_read_shelf_url,
        generate_screenshots
    )
    from .parser import get_current_read


requests_cache.install_cache(cache_name='goodreads-cache', backend='sqlite', expire_after=60*60*6)


# ---------- API ----------

@app.route('/api/currently-reading', methods=['get'])
def api_currently_reading():
    return flask.jsonify(get_current_read(request.headers.get('goodreads')))


@app.route('/api/currently-reading', methods=['post'])
def api_screenshot_currently_reading():
    data = request.json
    print(data)
    return flask.jsonify(data)



# -------------------------



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
    data = request.json

    print(f'\n\n\n\n[DEBUG]: {data}, {session["user"]}\n\n\n\n')

    year = int(data.get('year', '2022'))
    month = int(data.get('month', 1))

    gr = session['user']['goodreads']
    ig = session['user']['instagram']

    books = parse_monthly_books(
        build_gr_read_shelf_url(gr), year, month, data.get('noLowRatings', False)
    )

    print(f"\n\n\n\nDEBUG: {books}\n\n\n")

    build_html_page(
        books,
        year,
        month,
        data.get('style', 'elegant'),
        ig,
        data.get('showIGhandle', False)
    )
    return flask.jsonify(generate_screenshots(app.root_path, year, month, ig))


@app.route('/downloads/<path:filename>', methods=['GET'])
def download(filename):
    full_path = os.path.join(app.root_path, 'downloads')
    return flask.send_from_directory(full_path, filename)


@app.route('/currently-reading')
def currently_reading():
    if not session:
        flask.redirect(flask.url_for('setup'))
    return flask.render_template('currently-reading.html', session=session['user'])