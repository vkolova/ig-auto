import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import Phone from './Phone';
import Loading from './Loading';

axios.defaults.headers = {
    'goodreads': localStorage.getItem('goodreads'),
    'instagram': localStorage.getItem('instagram'),
}

import './css/index-styles.scss';

import { CurrentlyReading, Settings } from './CurrentlyReading';

const DEFAULT_SETTINGS = {
    simple: {
        post: {
            aspectRatio: '9x16',
            background: {
                type: 'color',
                value: 'white'
            }
        },
        title: {
            font: 'Sinthya',
            color: 'black',
            transform: 'lowercase',
            size: 'md'
        },
        cover: {
            size: 'md',
            borderRadius: '10'
        },
        credit: {
            show: false
        },
        progress: {
            show: true
        }
    }
};

class Editor extends React.Component {
    state = {
        loading: true,
        book: null,
        layout: 'simple',
        options: DEFAULT_SETTINGS.simple
    }

    image = React.createRef();

    componentDidMount () {
        axios.get('/api/currently-reading')
            .then(({ data }) => this.setState({ loading: false, book: data }))
            .catch(() => this.setState({ error: true }))
    }

    download = () => {
        console.log(this.image.current.innerHTML)
    };

    render () {
        const { loading } = this.state;

        return loading
            ? <Loading/>
            : <div className='currently-reading-editor'>
                <Phone>
                    <CurrentlyReading
                        book={this.state.book}
                        settings={this.state.options}
                        editor={this}
                        reference={this.image}
                    />
                </Phone>

                <Settings
                    settings={this.state.options}
                    editor={this}
                    defaultSettings={DEFAULT_SETTINGS.simple}
                >
                    <div className='btn btn--submit' onClick={this.download}>download</div>
                </Settings>
            </div>
        }
}

ReactDOM.render(
    <Editor></Editor>,
    document.getElementById('root')
);