import React from 'react';

import axios from 'axios';

import Phone from './Phone';
import Loading from './Loading';

import './css/currently-reading.scss';

const CurrentlyReading = ({
    book,
    settings,
    ...props
}) => {
    const {
        post,
        title,
        cover,
        credit
    } = settings;

    return <div
        className={`screen-content simple-layout ratio-${post.aspectRatio}`}
        ref={props.reference}
        style={{
            ...(
                post.background.type === 'color'
                    ? { backgroundColor: post.background.value }
                    : { backgroundImage: `url(${post.background.value})` }
            )
        }}
    >
        <div
            className={`title ${title.size}`}
            style={{
                fontFamily: title.font,
                color: title.color,
                textTransform: title.transform
            }}
        >
            currently reading
        </div>

        <div
            className={`book-cover cover-size-${cover.size}`}
            style={{
                borderRadius: `${cover.borderRadius}%`,
                backgroundImage: `url(${book.cover})`
            }}
        ></div>

        {
            credit.show &&
            <div
                className='credit'
                style={{
                    color: credit.color,
                    textTransform: credit.transform
                }}
            >{`@${localStorage.getItem('instagram')}`}</div>
        }
    </div>;
}

const POST_ASPECT_RATIOS = ['9x16','4x5'];

const POST_BACKGROUND_TYPES = ['color', 'image'];

const POST_BACKGROUND_COLORS = {
    'white': 'white',
    'plaster': '#eaeaea',
    'primrose pink': '#ecd6d9',
    'dark sakura': '#a0656b',
    'black': 'black'
};

const POST_BACKGROUND_IMAGES = {
    'pencil strokes': 'https://i.pinimg.com/564x/74/3c/9f/743c9fc233e1910572e0fb5ae3fff266.jpg',
    'pink stains ': 'https://i.pinimg.com/564x/f7/ff/6c/f7ff6c6fe5a26909e732c48df897f5f9.jpg',
    'blue waves': 'https://i.pinimg.com/564x/27/db/da/27dbdaea4470b9f9cb6f95c192f4992a.jpg',
    'pink waves': 'https://i.pinimg.com/564x/e9/72/0f/e9720f29fda3b357ff4edab2a5da31c2.jpg',
    'gray waves': 'https://i.pinimg.com/564x/d0/00/07/d00007ab011662b8e4e6b7cb99520833.jpg'
};

const TITLE_FONTS = [
    'Sinthya',
    'Catamaran',
    'Monalisa'
];

const TITLE_COLORS = {
    'white': 'white',
    'plaster': '#eaeaea',
    'primrose pink': '#ecd6d9',
    'dark sakura': '#a0656b',
    'black': 'black'
};

const TITLE_SIZES = {
    sm: 'small',
    md: 'medium',
    lg: 'large'
};

const TEXT_TRANSFORMS = [
    'lowercase',
    'capitalize',
    'uppercase'
];

const COVER_SIZES = {
    sm: 'small',
    md: 'medium',
    lg: 'large'
};

const COVER_BORDER_RADIUSES = ['0', '5', '10'];

class Settings extends React.Component {
    setPostAspectRatio = e => {
        const currentOptions = this.props.settings;
        currentOptions.post.aspectRatio = e.target.value;
        this.props.editor.setState({ options: currentOptions});
    }

    setBackgroundType = e => {
        const type = e.target.value;
        const currentOptions = this.props.settings;
        currentOptions.post.background.type = type;
        currentOptions.post.background.value = type === 'color'
            ? Object.values(POST_BACKGROUND_COLORS)[0]
            : Object.values(POST_BACKGROUND_IMAGES)[0];
        this.props.editor.setState({ options: currentOptions });
    }

    setBackgroundValue = e => {
        const currentOptions = this.props.settings;
        currentOptions.post.background.value = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    };

    setTitleFont = e => {
        const currentOptions = this.props.settings;
        currentOptions.title.font = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setTitleSize = e => {
        const currentOptions = this.props.settings;
        currentOptions.title.size = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setTitleColor = e => {
        const currentOptions = this.props.settings;
        currentOptions.title.color = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setTitleTransform = e => {
        const currentOptions = this.props.settings;
        currentOptions.title.transform = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setCoverSize = e => {
        const currentOptions = this.props.settings;
        currentOptions.cover.size = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setCoverBorderRadius = e => {
        const currentOptions = this.props.settings;
        currentOptions.cover.borderRadius = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setCreditShow = e => {
        const currentOptions = this.props.settings;
        currentOptions.credit.show = e.target.checked;
        this.props.editor.setState({ options: currentOptions });
    }

    setCreditColor = e => {
        const currentOptions = this.props.settings;
        currentOptions.credit.color = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    setCreditTransform = e => {
        const currentOptions = this.props.settings;
        currentOptions.credit.transform = e.target.value;
        this.props.editor.setState({ options: currentOptions });
    }

    render () {
        const { settings } = this.props;
        const {
            post,
            title,
            cover,
            credit
        } = settings;

        return <div className='cr---settings'>
            <h2>{`> currently reading`}</h2>

            <div className='section'>
                <h4>post</h4>

                <div className='row'>
                    <h6>{'ratio >'}</h6>
                    {
                        POST_ASPECT_RATIOS.map(ar =>
                            <label key={`post--aspect-ratio--${ar}`}>
                                <input
                                    type='radio'
                                    name={'post--aspect-ratio'}
                                    value={ar}
                                    checked={ar === post.aspectRatio}
                                    onChange={this.setPostAspectRatio}
                                />
                                <span style={{ letterSpacing: '5px' }}>{ar}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                <div className='row'>
                    <h6>{'background >'}</h6>
                    {
                        POST_BACKGROUND_TYPES.map(bt =>
                            <label key={`post--background--type--${bt}`}>
                                <input
                                    type='radio'
                                    name={'post--background--type'}
                                    value={bt}
                                    checked={bt === post.background.type}
                                    onChange={this.setBackgroundType}
                                />
                                <span>{bt}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                {
                    post.background.type === 'color' &&
                        <div className='row'>
                            <h6>{'| color >'}</h6>
                            {
                                Object.entries(POST_BACKGROUND_COLORS).map(([title, bc]) =>
                                    <label key={`post--background--value--${bc}`}>
                                        <input
                                            type='radio'
                                            name={'post--background--value'}
                                            value={bc}
                                            checked={bc === post.background.value}
                                            onChange={this.setBackgroundValue}
                                        />
                                        <span>{title}</span>
                                    </label>
                                )
                            }
                        </div>
                }

                {
                    post.background.type === 'image' &&
                        <div className='row'>
                            <h6>{'| image >'}</h6>
                            {
                                Object.entries(POST_BACKGROUND_IMAGES).map(([title, url]) =>
                                    <label key={`post--background--value--${url}`}>
                                        <input
                                            type='radio'
                                            name={'post--background--value'}
                                            value={url}
                                            checked={url === post.background.value}
                                            onChange={this.setBackgroundValue}
                                        />
                                        <span>{title}</span>
                                    </label>
                                )
                            }
                        </div>
                }
            </div>

            <div className='section'>
                <h4>title</h4>

                <div className='row'>
                    <h6>{'font >'}</h6>
                    {
                        TITLE_FONTS.map(fn =>
                            <label key={`title--font--${fn}`}>
                                <input
                                    type='radio'
                                    name={'title--font'}
                                    value={fn}
                                    checked={fn === title.font}
                                    onChange={this.setTitleFont}
                                />
                                <span style={{ fontFamily: fn }}>{fn}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                <div className='row'>
                    <h6>{'size >'}</h6>
                    {
                        Object.entries(TITLE_SIZES).map(([value, name]) =>
                            <label key={`title--size--${value}`}>
                                <input
                                    type='radio'
                                    name={'title--size'}
                                    value={value}
                                    checked={value === title.size}
                                    onChange={this.setTitleSize}
                                />
                                <span>{name}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                <div className='row'>
                    <h6>{'color >'}</h6>
                    {
                        Object.entries(TITLE_COLORS).map(([name, color]) =>
                            <label key={`title--color--${color}`}>
                                <input
                                    type='radio'
                                    name={'title--color'}
                                    value={color}
                                    checked={color === title.color}
                                    onChange={this.setTitleColor}
                                />
                                <span>{name}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                <div className='row'>
                    <h6>{'transform >'}</h6>
                    {
                        TEXT_TRANSFORMS.map(tt =>
                            <label key={`title--text-transform--${tt}`}>
                                <input
                                    type='radio'
                                    name={'title--text-transform'}
                                    value={tt}
                                    checked={tt === title.transform}
                                    onChange={this.setTitleTransform}
                                />
                                <span style={{ textTransform: tt }}>{tt}</span>
                            </label>
                        )
                    }
                </div>            
            </div>

            <div className='section'>
                <h4>cover</h4>

                <div className='row'>
                    <h6>{'size >'}</h6>
                    {
                        Object.entries(COVER_SIZES).map(([value, name]) =>
                            <label key={`cover--size--${value}`}>
                                <input
                                    type='radio'
                                    name={'cover--size'}
                                    value={value}
                                    checked={value === cover.size}
                                    onChange={this.setCoverSize}
                                />
                                <span>{name}</span>
                            </label>
                        )
                    }
                </div>

                <br />

                <div className='row'>
                    <h6>{'rounding >'}</h6>
                    {
                        COVER_BORDER_RADIUSES.map(br =>
                            <label key={`cover--border-radius--${br}`}>
                                <input
                                    type='radio'
                                    name={'cover--border-radius'}
                                    value={br}
                                    checked={br === cover.borderRadius}
                                    onChange={this.setCoverBorderRadius}
                                />
                                <span>{br}</span>
                            </label>
                        )
                    }
                </div>
            </div>
            
            <div className='section'>
                <h4>credit</h4>

                <div className='row'>
                    <h6>{'show >'}</h6>
                        <label key={`credit--show`}>
                            <input
                                type='checkbox'
                                name={'credit--show'}
                                checked={credit.show}
                                onChange={this.setCreditShow}
                            />
                            <span>show Instagram</span>
                        </label>
                </div>

                <br />

                <div className='row'>
                    <h6>{'color >'}</h6>
                    {
                        Object.entries(TITLE_COLORS).map(([name, color]) =>
                            <label key={`credit--color--${color}`}>
                                <input
                                    type='radio'
                                    name={'credit--color'}
                                    value={color}
                                    checked={color === credit.color}
                                    onChange={this.setCreditColor}
                                />
                                <span>{name}</span>
                            </label>
                        )
                    }
                </div>
                
                <br />

                <div className='row'>
                    <h6>{'transform >'}</h6>
                    {
                        TEXT_TRANSFORMS.map(tt =>
                            <label key={`credit--text-transform--${tt}`}>
                                <input
                                    type='radio'
                                    name={'credit--text-transform'}
                                    value={tt}
                                    checked={tt === credit.transform}
                                    onChange={this.setCreditTransform}
                                />
                                <span style={{ textTransform: tt }}>{tt}</span>
                            </label>
                        )
                    }
                </div>     

            </div>

            <br />

            { this.props.children }
        </div>;
    }
}

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
            borderRadius: '5'
        },
        credit: {
            show: true,
            color: 'black',
            transform: 'lowercase'
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
        console.log(this.image.current.outerHTML)
        this.setState({ loading: true });
        axios.post('/api/currently-reading', { html: this.image.current.outerHTML })
            .then(({ data }) => {
                console.log(data)
                const url = data[0];
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = true;
                document.body.appendChild(anchor);
                anchor.click();
                this.setState({ loading: false })
            })
            .catch(() => this.setState({ error: true }))
    };

    render () {
        const { loading, book, options } = this.state;

        return loading
            ? <Loading/>
            : <div className='currently-reading-editor'>
                <Phone>
                    <CurrentlyReading
                        book={book}
                        settings={options}
                        editor={this}
                        reference={this.image}
                    />
                </Phone>

                <Settings
                    settings={options}
                    editor={this}
                    defaultSettings={DEFAULT_SETTINGS.simple}
                >
                    <div className='btn btn--submit' onClick={this.download}>download</div>
                </Settings>
            </div>
    }
}

export default Editor;

