import React from 'react'

const Html = ({ content, state, stats: { style, main = 'bundle.js' } }) => (
  <html>
    <head>

      <meta charSet='utf-8'/>
      <meta name='viewport' content='width=device-width' />
      <link rel='icon' href='/assets/favicon.ico' type='image/x-icon'/>

      <title>{'Starveller'}</title>

      <link href='https://cdnjs.cloudflare.com/ajax/libs/octicons/3.3.0/octicons.min.css' rel='stylesheet' type='text/css' />
      <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,700' rel='stylesheet' type='text/css' />

      <script src='https://cdn.socket.io/socket.io-1.3.7.js'></script>

      {style && (
        <link href={`/dist/${style}`} rel='stylesheet'/>
      )}

      {state && (
        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(state)}` }}/>
      )}

    </head>
    <body>

      <div id='root' dangerouslySetInnerHTML={{ __html: content }}/>
      <script src={`/dist/${main}`}></script>

    </body>
  </html>
)

export default Html
