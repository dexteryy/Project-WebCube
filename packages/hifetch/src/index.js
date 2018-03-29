/* eslint-disable filenames/match-exported */
import 'isomorphic-fetch';
import qs from 'qs';

const mimeLib = {
  json: 'application/json',
  form: 'multipart/form-data',
  html: 'text/html',
  xml: 'application/xml',
  text: 'text/plain',
};

class Hifetch {
  static defaultConfig = {
    url: '',
    method: 'get',
    query: null,
    data: '',
    dataType: 'application/x-www-form-urlencoded',
    FormData: typeof window !== 'undefined' ? window.FormData : null,
    jwtToken: '',
    headers: {},
    timeout: 0,
    responseType: 'application/json',
    mergeHeaders: {},
    filterHeaders: null,
    enableCookies: false,
    disableCORS: false,
    disableResponseStyle: false,
    responseStyle: 'google',
    enableMeta: false,
    enableResponseObject: false,
    disableStatusValidator: false,
    validateStatus(status) {
      return status >= 200 && status < 300;
    },
    parser(response) {
      return response.json();
    },
    handler(data, headersForMerge) {
      return typeof data !== 'string' && !Array.isArray(data)
        ? Object.assign(headersForMerge, data)
        : data;
    },
    success: res => res,
    error: res => Promise.reject(res),
  };

  /* eslint-disable max-statements */
  constructor(opt) {
    this._config = Object.assign({}, Hifetch.defaultConfig, opt);
    const {
      query,
      method,
      responseType,
      data,
      dataType: originDataType,
      FormData,
      headers,
      jwtToken,
      enableCookies,
      disableCORS,
    } = this._config;
    this._queryString = query ? qs.stringify(query) : '';
    const fetchOpt = {};
    this._fetchOpt = fetchOpt;
    if (!disableCORS) {
      fetchOpt.mode = 'cors';
    }
    if (enableCookies) {
      fetchOpt.credentials = disableCORS ? 'same-origin' : 'include';
    }
    const moreHeaders = {
      Accept: /\//.test(responseType) ? responseType : mimeLib[responseType],
    };
    if (jwtToken) {
      moreHeaders.Authorization = `Bearer ${jwtToken}`;
    }
    let dataType;
    let dataForBody = data;
    const mergeToForm = dict => {
      Object.keys(dict).forEach(key => {
        dataForBody.append(key, dict[key]);
      });
    };
    if (data) {
      dataType =
        (/\//.test(originDataType)
          ? originDataType
          : mimeLib[originDataType]) || Hifetch.defaultConfig.dataType;
      if (typeof data === 'object') {
        if (FormData && data instanceof FormData) {
          dataType = mimeLib.form;
        } else if (dataType === mimeLib.form) {
          dataForBody = new FormData();
          mergeToForm(data);
        } else if (dataType === Hifetch.defaultConfig.dataType) {
          dataForBody = qs.stringify(data);
        } else if (dataType.indexOf('json') !== -1) {
          dataForBody = JSON.stringify(data);
        }
      }
    }
    Object.assign(
      fetchOpt,
      {
        method: method.toUpperCase(),
        headers: Object.assign(
          {},
          headers,
          moreHeaders,
          !dataType || dataType === mimeLib.form
            ? {
                // leave Content-Type' field empty, Fetch APi will automatically create:
                // Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu
              }
            : {
                'Content-Type': dataType,
              },
        ),
      },
      data
        ? {
            body: dataForBody,
          }
        : {},
    );
  }
  /* eslint-enable max-statements */

  send() {
    const {
      url,
      timeout,
      validateStatus,
      disableStatusValidator,
      mergeHeaders,
      filterHeaders,
      disableResponseStyle,
      responseStyle,
      enableMeta,
      enableResponseObject,
      parser,
      handler,
      success,
      error,
    } = this._config;
    const current = uuid();
    this._current = current;
    let _filterHeaders;
    if (filterHeaders) {
      _filterHeaders = {};
      for (const header in filterHeaders) {
        _filterHeaders[header.toLowerCase()] = filterHeaders[header];
      }
    }
    return new Promise((resolve, reject) => {
      if (timeout) {
        setTimeout(() => {
          if (current === this._current) {
            reject(new Error('TIMEOUT'));
          }
        }, timeout);
      }
      return fetch(
        this._queryString ? `${url}?${this._queryString}` : url,
        this._fetchOpt,
      )
        .then(res => {
          if (current === this._current) {
            resolve(res);
          }
        })
        .catch(res => {
          if (current === this._current) {
            reject(res);
          }
        });
    })
      .then(response => {
        try {
          if (disableStatusValidator || validateStatus(response.status)) {
            return response;
          }
        } catch (e) {
          return error(
            Object.assign(
              new Error(`[CUSTOM JS ERROR] ${clearErrorMessage(e)}`),
              {
                status: 4,
                error: e,
              },
            ),
          );
        }
        const err = new Error(response.statusText);
        err.response = response;
        throw err;
      })
      .then(response => {
        const headersForMerge = {};
        Object.keys(mergeHeaders).forEach(key => {
          const header = mergeHeaders[key];
          if (header) {
            headersForMerge[key] = response.headers.get(header);
          }
        });
        const withHeaders = data => {
          const { status, statusText, url: resUrl, headers } = response;
          const allHeaders = {};
          let headerEntries = [];
          if (headers._headers) {
            headerEntries = Object.keys(headers._headers).map(key => [
              key,
              headers._headers[key].join('; '),
            ]);
          } else if (headers.entries) {
            headerEntries = headers.entries();
          }
          for (const i of headerEntries) {
            if (i && i[0] && (!_filterHeaders || _filterHeaders[i[0]])) {
              allHeaders[i[0]] = i[1];
            }
          }
          const meta = {
            status: 0,
            httpStatus: status,
            httpStatusText: statusText,
            url: resUrl,
            headers: allHeaders,
          };
          if (enableResponseObject) {
            meta.response = response;
          }
          return {
            data,
            headersForMerge,
            meta,
          };
        };
        let parsed;
        try {
          parsed = parser(response);
        } catch (err) {
          return error(
            Object.assign(
              new Error(`[CUSTOM JS ERROR] ${clearErrorMessage(err)}`),
              {
                status: 4,
                error: err,
              },
            ),
          );
        }
        if (parsed.then) {
          /* eslint-disable promise/no-nesting */
          return parsed.then(withHeaders);
          /* eslint-enable promise/no-nesting */
        }
        return withHeaders(parsed);
      })
      .then(({ data, headersForMerge, meta }) => {
        try {
          const result = handler(
            (!disableResponseStyle &&
              responseStyle === 'google' &&
              !data.error &&
              data.data) ||
              data,
            headersForMerge,
            meta,
          );
          if (!disableResponseStyle && typeof result === 'object') {
            if (responseStyle === 'unix' && result.status < 0) {
              return error(
                Object.assign(
                  new Error(
                    `[REMOTE ERROR] status: ${data.status}, message: ${
                      data.message
                    }`,
                  ),
                  Object.assign({}, meta, {
                    status: data.status,
                    originMessage: data.message,
                    data: result,
                  }),
                ),
              );
            } else if (responseStyle === 'google' && result.error) {
              const {
                code,
                message: originMessage,
                errors = [{}],
              } = result.error;
              const { reason } = errors[0];
              return error(
                Object.assign(
                  new Error(
                    `[REMOTE ERROR] reason: ${reason}, code: ${code}, message: ${originMessage}`,
                  ),
                  Object.assign({}, meta, {
                    status: 3,
                    code,
                    originMessage,
                    reason,
                    errors,
                    data: result,
                  }),
                ),
              );
            }
          }
          return success(
            enableResponseObject || enableMeta
              ? Object.assign(
                  {
                    data: result,
                  },
                  meta,
                )
              : result,
          );
        } catch (err) {
          return error(
            Object.assign(
              new Error(`[CUSTOM JS ERROR] ${clearErrorMessage(err)}`),
              Object.assign({}, meta, {
                status: 4,
                error: err,
              }),
            ),
          );
        }
      })
      .catch(err => {
        if (typeof err === 'object' && err.message === 'TIMEOUT') {
          return error(
            Object.assign(
              new Error(`[TIMEOUT ERROR] limit: ${timeout / 1000}s`),
              {
                status: 5,
                timeout,
              },
            ),
          );
        }
        if (err.status) {
          return error(Object.assign(new Error(err.message), err));
        }
        const { status: httpStatus, statusText: httpStatusText } =
          err.response || {};
        if (httpStatus) {
          return error(
            Object.assign(
              new Error(`[FETCH ERROR] ${httpStatus} ${httpStatusText}`),
              {
                status: 2,
                httpStatus,
                httpStatusText,
              },
            ),
          );
        }
        return error(
          Object.assign(
            new Error(`[INTERNAL JS ERROR] ${clearErrorMessage(err)}`),
            {
              status: 1,
              error: err,
            },
          ),
        );
      });
  }

  cancel() {
    this._current = null;
  }

  error(customError) {
    const { error } = this._config;
    this._current = null;
    return error(
      Object.assign(
        new Error(`[MANUAL ERROR] ${clearErrorMessage(customError)}`),
        {
          status: 6,
          customError,
        },
      ),
    );
  }
}

function uuid() {
  return new Date().getTime() * 1000 + Math.floor(Math.random() * 1000);
}

function clearErrorMessage(err) {
  return err.toString(); // .replace(/.+:\s*/, '');
}

function hifetch(opt) {
  return new Hifetch(opt);
}

hifetch.Class = Hifetch;

export default hifetch;

/* eslint-enable filenames/match-exported */
