<h1 align="center">ErrorBucket</h1>
<br/>
<p align="center">
<img src="https://avatars3.githubusercontent.com/u/12426710?v=3&s=300" style="margin:0 auto;"/>
<p align="center">
One bucket to rule all JavaScript errors fired by your visitor's browsers
</p>
<p align="center">
Based on Lapple's
<a href="https://github.com/Lapple/ErrorBoard">ErrorBoard</a>
</p>
</p>

<br/>

----------

<br/>


### Configuration file

#### Basic

The following codes are in `config.sample.json`, shipped with the project. If no `config.json` found in root directory, `config.sample.json` will be used to generate a default `config.json`.

```js
{
  "db":"mongodb://localhost:27017/ErrorBucket", // MongoDB Connection String
  "port": 3000, // Listening Port
  "baseurl": "http://localhost:3000" // Base URL
}
```

#### Advanced

```js
{
  "db":"mongodb://localhost:27017/ErrorBucket?maxPoolSize=10",
  "port": 3000,
  "baseurl": "http://localhost:3000",
  "logttl": 345600, // Time to Live for Each Error Log
  "errorAlert": {
    "interval": 600, // The Unit Time
    "threshold": 600, // Threshold
    "recipient": ["user@example.com", "name@example.com"]
  },
  "auth": {
    "google": {
      "enabled": false,
      "emailpattern": "@example\\.(com|net)",
      "clientID": "<Your Client ID>",
      "clientSecret": "<Your Client Secret>"
    },
    "github": {
      "enabled": true,
      "organizationMembership": ["example"],
      "clientID": "<Your Client ID>",
      "clientSecret": "<Your Client Secret>"
    },
    "local": {
      "enabled": false,
      "users": [
        {"username": "user", "password": "__pass__"},
        {"username": "name", "password": "__word__"}
      ]
    }
  }
}
```


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

### Original License

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
