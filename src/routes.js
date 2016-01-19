import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'components/App'

import Home from 'pages/Home'
import Browse from 'pages/Browse'
import Builder from 'pages/Builder'
import Repo from 'pages/Repo'
import Fail from 'pages/Fail'
import About from 'pages/About'

export default (
  <Route path='/' component={App}>
    <Route path='browse' component={Browse} />
    <Route path='fail' component={Fail} />
    <Route path='build' component={Builder} />
    <Route path='about' component={About} />
    <Route path=':owner/:reponame' component={Repo} />
    <IndexRoute component={Home}/>
  </Route>
)
