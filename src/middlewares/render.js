import path from 'path'
import React from 'react'
import { Provider } from 'react-redux'
import createLocation from 'history/lib/createLocation'
import { createMemoryHistory } from 'history'
import { RoutingContext, match } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { getPrefetchedData } from 'react-fetcher'

import config from 'config'
import routes from 'routes'
import createStore from 'createStore'

import Html from 'Html'

export default (req, res) => {

  const location = createLocation(req.url)

  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if (err) {
      return res.redirect('/fail')
    }

    if (!renderProps) {
      return res.redirect('/fail')
    }

    const store = createStore(createMemoryHistory())

    const { dispatch } = store

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch
    }

    const components = renderProps.routes.map(route => route.component)

    getPrefetchedData(components, locals).then(() => {

      const app = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
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

    }).catch(err => {
      /* eslint-disable no-console */
      console.log(err.stack)
      /* eslint-enable no-console */
      res.redirect('/fail')
    })

  })

}
