import os
import time
import datetime
import shutil
import concurrent.futures
from pathlib import Path

import requests
from bs4 import BeautifulSoup, SoupStrainer
from selenium import webdriver

if os.environ.get('HEROKU'):
    from book import Book
else:
    from .book import Book

reviews_selector = SoupStrainer('tr', {'class': 'bookalike review'})

def build_gr_read_shelf_url(user_id):
    return f'https://www.goodreads.com/review/list/{user_id}?shelf=read&print=true&per_page=200'

def parse_monthly_books(url, year, month, filter_low_ratings = False):
    previous_year = str(int(year) - 1)
    month_short_name = datetime.date(year, month, 1).strftime('%b')

    page = requests.get(url)
    reviews = BeautifulSoup(page.text, 'html.parser', parse_only=reviews_selector)

    books = []

    for review in reviews:
        date_finished = review.select('.date_read_value')[0].text.strip()

        if month_short_name in date_finished and str(year) in date_finished:
            book = Book()
            book.url = 'https://www.goodreads.com' + review.select('.title > div > a')[0].attrs['href']

            try:
                series = review.select('.darkGreyText')[0].text
                if series:
                    book.title = review.select('.title > div > a')[0].attrs['title'].replace(f' {series}', '').split(' (')[0].split(':')[0]
                    book.series = series.replace('(', '').replace(')', '')
            except Exception:
                book.title = review.select('.title > div > a')[0].attrs['title'].split(' (')[0].split(':')[0]

            book.rating = len(review.select('.staticStar.p10'))
            book.shelves = [s.text.strip() for s in review.select('.shelfLink') if s.text.strip() not in ['read', 'dnf', 'underappreciated-book', 'favorites', 'arc']]

            if filter_low_ratings:
                if book.rating > 3:
                    books.append(book)
            else:
                books.append(book)

        if  previous_year in date_finished:
            break

    books.reverse()

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        executor.map(Book.hidrate, books)
    
    return books


def divide_chunks(l, n):
    for i in range(0, len(l), n): 
        yield l[i:i + n]


def build_elegant_style_html(fd, books, month, instagram, show_ig_handle):
    month_name = datetime.date(2000, month, 1).strftime('%B')
    fd.write(f"""<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="monthly-style-elegant.css">
        </head>
        <body>
""")

    fd.write('\t<div class="page main">\n')
    fd.write(f'\t\t<div class="month">{month_name}</div>\n')
    fd.write(f'\t\t<div class="wrap-up">wrap up</div>\n')
    fd.write('\t</div>\n')

    chunks = [c for c in divide_chunks(books, 5)]
    for chunk in chunks:
        fd.write(f'<ul class="page">\n')
        for book in chunk:
            fd.write(book.elegant())
            fd.write('\n')
        fd.write('</ul>\n')
    fd.write("""</body>\n</html>""")


def build_polaroid_style_html(fd, books, month, instagram, show_ig_handle):
    month_name = datetime.date(2000, month, 1).strftime('%B')
    fd.write(f"""<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="monthly-style-polaroid.css">
        </head>
        <body>
""")
    chunks = [c for c in divide_chunks(books, 6)]
    for chunk in chunks:
        fd.write(f'<div class="page month-{month}">\n')
        fd.write('\t<div class="title">\n')
        fd.write(f'\t\t<div class="month">{month_name}</div>\n')
        fd.write(f'\t\t<div class="wrap-up">wrap up</div>\n')
        fd.write('\t</div>\n')
        for book in chunk:
            fd.write(book.polaroid())
            fd.write('\n')
        show_ig_handle and fd.write(f'<div class="footer"><div class="ig">@{instagram}</div></div>')
        fd.write('</div>\n')
    fd.write("""</body>\n</html>""")


STYLES_METHOD = {
    'elegant': build_elegant_style_html,
    'polaroid': build_polaroid_style_html
}

def build_html_page(books, year, month, style, instagram, show_ig_handle):
    with open(f'wrap-ups/{instagram}-{year}-{month}.html', 'w', encoding='utf-8') as fd:
        STYLES_METHOD[style](fd, books, month, instagram, show_ig_handle)

def generate_screenshots(path, year, month, instagram):
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    options.add_experimental_option('useAutomationExtension', False)

    if os.environ.get('HEROKU'):
        options.binary_location = os.environ.get('GOOGLE_CHROME_BIN')
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")
        options.add_argument("--headless")
        driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=options)
    else:
        driver = webdriver.Chrome(options=options)

    html_file_location = os.path.join(path, 'wrap-ups', f'{instagram}-{year}-{month}.html')
    print(f'\n\n\n{html_file_location}\n\n\n')

    with open(html_file_location, 'r') as fd:
        print(fd.read(), '\n\n\n\n')

    driver.get(html_file_location)
    driver.set_window_size(1920, 1080)
    driver.fullscreen_window()
    time.sleep(2)

    Path('downloads').mkdir(parents=True, exist_ok=True)

    pages = driver.find_elements_by_css_selector('.page')
    results = []
    for count, page in enumerate(pages):
        file_name = f'{instagram}-{year}-{month}-{count}.png'
        page.screenshot(file_name)
        shutil.move(file_name, f'downloads/{file_name}')
        results.append(f'downloads/{file_name}')
    driver.quit()

    return results
