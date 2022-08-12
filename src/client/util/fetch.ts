import pony from 'fetch-ponyfill';

const { fetch, Request, Response, Headers, DOMException } = pony();
export { fetch, Request, Response, Headers, DOMException };
