import os
import datetime
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
        take_page_screenshots,
        generate_screenshots
    )
    from parser import get_current_read
else:
    app.debug = True

    from .utils import (
        build_html_page,
        parse_monthly_books,
        build_gr_read_shelf_url,
        take_page_screenshots,
        generate_screenshots
    )
    from .parser import get_current_read


requests_cache.install_cache(cache_name='goodreads-cache', backend='sqlite', expire_after=60*60*6)


CURRENTLY_READING_HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../static/styles.css" />
    <link rel="stylesheet" href="../static/screenshots.css" />
</head>
<body>
    {html}
</body>
</html>
"""

# ---------- API ----------

@app.route('/api/currently-reading', methods=['get'])
def api_currently_reading():
    return flask.jsonify(get_current_read(request.headers.get('goodreads')))


@app.route('/api/currently-reading', methods=['post'])
def api_screenshot_currently_reading():
    html = request.json.get('html')
    instagram = request.headers.get('instagram')
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%d--%H-%M-%S')
    html_file = f'temp/cr-{instagram}-{timestamp}.html'

    with open(html_file, 'w', encoding='utf-8') as fd:
        fd.write(CURRENTLY_READING_HTML_TEMPLATE.format(html=html))

    return flask.jsonify(take_page_screenshots(app.root_path, html_file, selector='.screen-content'))


# -------------------------



@app.route('/')
def home():
    return flask.render_template('base.html')


@app.route('/api/generate-monthly-wrap-up', methods=['post'])
def generate_monthly_wrap_up():
    data = request.json

    year = int(data.get('year', '2022'))
    month = int(data.get('month', 1))

    gr = session['user']['goodreads']
    ig = session['user']['instagram']

    books = parse_monthly_books(
        build_gr_read_shelf_url(gr), year, month, data.get('noLowRatings', False)
    )

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


@app.errorhandler(404)
def page_not_found(e):
    return flask.render_template('base.html')