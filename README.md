## ErrorBoard

Track and fix JavaScript errors fired by your visitor's browsers.

### Screenshots

![Messages view](http://i.imgur.com/Db3kudo.png)

![Details view](http://i.imgur.com/I4h33hr.png)

![Browsers view](http://i.imgur.com/99OEaGy.png)

### Prerequisites

* Node.js and NPM
* A free port

### Installation

    $ git clone git://github.com/Lapple/ErrorBoard.git
    $ cd ErrorBoard
    $ npm install

### Configuration

Edit the `config.json` under `config` directory:

```js
{
  "dbfile": "db", // path to database file
  "port": 3000    // web application port
}
```

If you do not have a `config.json` under `config` directory, `config.sample.json` will be used to generate a new `config.json` for you. This way, you can get a quick start to explore this project.

### Access Control

By default, this project can be viewed by anyone who knows the URL. If you want to add access control, you can configure it in `config.json` as well:

```js
{
  "dbfile": "data/db",
  "port": 3000,
  "baseurl": "<Root Path of the Project>",
  "auth": {
    "emailpattern": "<Your Email Pattern>",
    "methods": {
      "google-oauth2": {
        "enabled": true,
        "clientID": "<Your Client ID>",
        "clientSecret": "<Your Secret>"
      }
    }
  }
}
```

This project makes use of [Passport.js](http://passportjs.org/), which supports more than 140 authentication strategies including your favorite social authentications like Facebook, Twitter and Google. It's worthwhile to take a minute to learn how to use this middleware.

If `auth` field is not set in `config.json` or the `enabled` field of all the methods are set to `false`, then no authentication will be enforced. Everyone can view the content of this project. Otherwise, the methods that have `enabled` field set to `true` will be used to authenticate users.

`emailpattern` under `auth` is optional. If it is not set, everyone who passes the authentication API can log into the project. Otherwise, the users' email addresses will be validated after authentication API has returned.

`emailpattern` can be either regexp or array. For example:

```json
"auth": {
    "emailpattern": "@baixing\\.(com|net)$",  
}

vs.

"auth": {
    "emailpattern": ["@baixing\\.com", "@baixing\\.net"],
}
```

Both ways are supported.

Fields under `methods` should match the name of the corresponding adapter. For example, `google-oauth2` in the example above matches the name of `authentication-google-oauth2.js`.

### Running

After you have everything installed and configured, run:

    npm start

Once the app has started successfully, navigate to `localhost` at specified port (*e.g.* http://127.0.0.1:3000/) to get the error data. Similar error messages are not grouped, however the one can navigate to *Scripts* tab to get the idea which file:line pairs produce most errors.

### Browser snippet

The first time you visited http://127.0.0.1:3000/ you probably won't see any errors since they were not being sent to the board. To start sending errors, make sure that the following JavaScript snippet is the first code, executed on your pages:

```js
// JavaScript
window.onerror = function( message, url, line, column, error ) {
  var e = encodeURIComponent;
  ( new Image() ).src = 'http://127.0.0.1:3000/error?message=' + e( message ) +
                                                   '&url='     + e( url ) +
                                                   '&line='    + e( line ) +
                          ( error && error.stack ? '&stack='   + e( error.stack ) : '' ) +
                                        ( column ? '&column='  + e( column ) : '' );
};
```

Replace `127.0.0.1:3000` with the address and the port number your ErrorBoard is running.

### License

(The MIT License)

Copyright (c) 2014 Aziz Yuldoshev &lt;yuldoshev.aziz@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
