import os
import re

import requests
from bs4 import BeautifulSoup
import requests_cache

if os.environ.get('HEROKU', __name__ == '__main__'):
    from book import Book
else:
    from .book import Book

NO_COVER_SVG = 'https://s.gr-assets.com/assets/react_components/currently_reading/icn_default_CR_ltrail-16f28d39654104ceb329648a474943eb.svg'

def build_profile_url(id):
    return f'https://www.goodreads.com/user/show/{id}'


def format_series(string):
    series = string.strip().replace('(', '').replace(')', '').replace(' Book ', ', #')
    series = re.sub('(?<=[a-z])\s#', ', #', series)
    return series


def get_book(url):
    book_url = url if url.startswith('https') else f'https://www.goodreads.com{url}'
    page = requests.get(book_url)
    document = BeautifulSoup(page.text, 'html.parser')

    seriesEl = document.find(id='bookSeries') or document.select_one('h3.Text.Text__title3.Text__italic.Text__regular.Text__subdued')
    coverEl = document.select_one('#coverImage') or document.select_one('div.BookPage__bookCover > div > div > div > div > div > div > img')

    return Book(
        title=(document.find(id='bookTitle') or document.select_one('h1.Text.Text__title1')).text.strip(),
        series=format_series(seriesEl.text) if seriesEl else None,
        authors=[
            ah.text
            for ah
            in document.select('#bookAuthors > span > div > a') or document.select('.ContributorLinksList .ContributorLink')
        ],
        cover=coverEl.attrs['src'].split(' ')[0] if coverEl else NO_COVER_SVG,
        url=book_url,
    )


def get_current_read(gr_id):
    with requests_cache.disabled():
        page = requests.get(build_profile_url(gr_id))
    document = BeautifulSoup(page.text, 'html.parser')

    cr_section = document.select_one('#currentlyReadingReviews')
    cr_url = cr_section.select_one('.bookTitle').attrs['href']
    cr_progress = cr_section.select_one('.greyText.smallText').text.replace('(', '').replace(')', '').replace('%', '')

    book = get_book(cr_url)
    book.progress = int(cr_progress)
    return book
