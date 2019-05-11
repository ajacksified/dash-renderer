/* global fetch: true */
import {mergeDeepLeft} from 'ramda';
import {onError, getCSRFHeader} from '../actions';
import {urlBase} from '../utils';

function GET(path, fetchConfig) {
    return fetch(path, mergeDeepLeft({
        method: 'GET',
        headers: getCSRFHeader()
    }, fetchConfig));
}

function POST(path, fetchConfig, body = {}) {
    return fetch(path, mergeDeepLeft({
        method: 'POST',
        headers: getCSRFHeader(),
        body: body ? JSON.stringify(body) : null,
    }, fetchConfig));
}

const request = {GET, POST};

export default function apiThunk(endpoint, method, store, id, body) {
    return (dispatch, getState) => {
        const {config} = getState();

        const url = `${urlBase(config)}${endpoint}`;

        dispatch({
            type: store,
            payload: {id, status: 'loading'},
        });
        return request[method](url, config.fetch, body)
            .then(res => {
                const contentType = res.headers.get('content-type');
                if (
                    contentType &&
                    contentType.indexOf('application/json') !== -1
                ) {
                    return res.json().then(json => {
                        dispatch({
                            type: store,
                            payload: {
                                status: res.status,
                                content: json,
                                id,
                            },
                        });
                        return json;
                    });
                }
                return dispatch({
                    type: store,
                    payload: {
                        id,
                        status: res.status,
                    },
                });
            })
            .catch(err => {
                const errText = (typeof err.text === 'function') ?
                    err.text() :
                    Promise.resolve(err);

                errText.then(text => {
                    dispatch(
                        onError({
                            type: 'backEnd',
                            errorPage: text,
                        })
                    );
                });
            });
    };
}
