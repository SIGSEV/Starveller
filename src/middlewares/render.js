import path from 'path'
import React from 'react'
import { Provider } from 'react-redux'
import createLocation from 'history/lib/createLocation'
import { RoutingContext, match } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

import { fetchRepo, fetchReposList } from 'actions/repos'

import config from 'config'
import routes from 'routes'
import createStore from 'createStore'

const Html = ({ content, state, stats: { style, main = 'bundle.js' } }) => (
  <html>
    <head>

      <base href='/'/>
      <meta charSet='utf-8'/>
      <meta name='viewport' content='width=device-width' />
      <link rel='icon' href='assets/favicon.ico' type='image/x-icon'/>

      <title>{'[::]'}</title>

      <link href='https://fonts.googleapis.com/css?family=Rambla:400,700' rel='stylesheet' type='text/css' />
      <link href='https://cdnjs.cloudflare.com/ajax/libs/octicons/3.3.0/octicons.min.css' rel='stylesheet' type='text/css' />

      {style && (
        <link href={`dist/${style}`} rel='stylesheet'/>
      )}

      {state && (
        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(state)}` }}/>
      )}

    </head>
    <body>

      <div id='root' dangerouslySetInnerHTML={{ __html: content }}/>
      <script src={`dist/${main}`}></script>

    </body>
  </html>
)

export default (req, res) => {

  const location = createLocation(req.url)

  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if (err) { return res.redirect('/fail') }
    if (!renderProps) { return res.redirect('/fail') }

    const store = createStore()

    const { params } = renderProps
    const { owner, reponame } = params

    const init = [
      store.dispatch(fetchReposList())
    ]

    if (owner && reponame) {
      init.push(store.dispatch(fetchRepo({ name: `${owner}/${reponame}` })))
    }

    Promise.all(init).then(() => {

      const app = (
        <Provider store={store}>
          <RoutingContext {...renderProps}/>
        </Provider>
      )

      const state = store.getState()

      const stats = (config.env === 'production')
        ? require(path.join(config.distFolder, 'stats.json'))
        : {}

      const HtmlComponent = (
        <Html
          stats={stats}
          content={renderToString(app)}
          state={state}/>
      )

      const markup = renderToStaticMarkup(HtmlComponent)
      const page = `<!doctype html>${markup}`

      res.end(page)

    }).catch(() => { res.redirect('/fail') })

  })

}
