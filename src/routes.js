import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'components/App'

import Home from 'pages/Home'
import Browse from 'pages/Browse'
import Repo from 'pages/Repo'

export default (
  <Route path='/' component={App}>
    <Route path='browse' component={Browse} />
    <Route path='/:owner/:reponame' component={Repo} />
    <IndexRoute component={Home}/>
  </Route>
)
