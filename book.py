from pdb import set_trace
import re

from dataclasses import dataclass, field

import requests
from bs4 import BeautifulSoup


@dataclass
class Book:
    title: str = None
    series: str = None
    authors: list = field(default_factory=list)
    url: str = None
    cover: str = None
    rating: int = None
    progress: int = None
    shelves: list = field(default_factory=list)

    @classmethod
    def from_dict(cls, data):
        return cls(
            title=data.get('title'),
            series=data.get('series'),
            authors=data.get('authors'),
            cover=data.get('cover'),
            rating=data.get('rating'),
            shelves=data.get('shelves'),
            url=data.get('url')
        )

    @classmethod
    def hidrate(cls, book):
        print(book.url)
        page = requests.get(book.url)
        soup = BeautifulSoup(page.text, 'html.parser')

        book.authors = [ah.text for ah in soup.select('#bookAuthors > span > div > a') or soup.select('.ContributorLinksList .ContributorLink')]
        coverEl = soup.select('#coverImage') or soup.select('div.BookPage__bookCover > div > img')
        book.cover = coverEl[0].attrs['src'] if coverEl else 'https://s.gr-assets.com/assets/react_components/currently_reading/icn_default_CR_ltrail-16f28d39654104ceb329648a474943eb.svg'

        seriesEl = soup.select('#bookSeries')
        if seriesEl:
            series = seriesEl[0].text.strip().replace('(', '').replace(')', '')
            book.series = book.series if book.series else series
            book.series = book.series.replace(' Book ', ', #')
            book.series = re.sub('(?<=[a-z])\s#', ', #', book.series)
  
    
    def elegant(self):
        tags_list = ', '.join([f'<div class="tag">{t}</div>' for t in self.shelves])
        return f"""
        <li>
            <a class="cover" href="{self.url}"><img src="{self.cover}"/></a>
            <div class="data">
                {f'<div class="series">{self.series}</div>' if self.series else ''}<div class="title">{self.title}</div>
                <div class="authors">{', '.join([f'<div class="author">{a}</div>' for a in self.authors])}</div>
                <div class="rating">{self.rating * "★"}{(5-self.rating) * "☆"}</div>{f'<div class="tags">{tags_list}</div>' if tags_list else ''}
            </div>
        </li>
    """

    def polaroid(self):
        return f"""
        <div class="li">
            <div class="wrapper">
                <a class="cover" href="{self.url}"><img src="{self.cover}"/></a>
                <div class="rating">{self.rating * "★"}</div>
            </div>
        </div>
    """
