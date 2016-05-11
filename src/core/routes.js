import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'core/components/App'

import Home from 'core/pages/Home'
import Builder from 'core/pages/Builder'
import Repo from 'core/pages/Repo'
import Fail from 'core/pages/Fail'
import About from 'core/pages/About'

export default (
  <Route path='/' component={App}>
    <Route path='fail' component={Fail} />
    <Route path='battle' component={Builder} />
    <Route path='battle/:query' component={Builder} />
    <Route path='about' component={About} />
    <Route path=':owner/:reponame' component={Repo} />
    <IndexRoute component={Home}/>
  </Route>
)
