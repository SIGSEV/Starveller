import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'components/App'
import Home from 'pages/Home'
import Browse from 'pages/Browse'

export default (
  <Route path='/' component={App}>
    <Route path='browse' component={Browse} />
    <IndexRoute component={Home}/>
  </Route>
)
