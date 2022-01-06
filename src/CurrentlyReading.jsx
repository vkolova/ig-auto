import React from 'react';

import './css/currently-reading.scss';

const Simple = ({
    aspectRatio,
    backgroundColor,
    title,
    cover,
    credit,
    ...props
}) =>
    <div
        className={`screen-content simple-layout ratio-${aspectRatio}`}
        style={{
            backgroundColor
        }}
    >
        <div
            className='title'
            style={{
                fontFamily: title.font,
                fontSize: title.size,
                textTransform: title.transform
            }}
        >
            currently reading
        </div>

        <div
            className={`book-cover cover-size-${cover.size}`}
            style={{
                borderRadius: `${cover.borderRadius}px`
            }}
        ></div>

        { credit.show && <div className='credit'>@{credit.username}</div> }
    </div>;


export {
    Simple
};
