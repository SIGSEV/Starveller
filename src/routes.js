import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'components/App'

import Home from 'pages/Home'
import Browse from 'pages/Browse'
import Builder from 'pages/builder'
import Repo from 'pages/Repo'
import Create from 'pages/Create'
import Fail from 'pages/Fail'
import Shot from 'pages/Shot'

export default (
  <Route path='/' component={App}>
    <Route path='browse' component={Browse} />
    <Route path='create' component={Create} />
    <Route path='fail' component={Fail} />
    <Route path='build' component={Builder} />
    <Route path=':owner/:reponame' component={Repo} />
    <Route path=':owner/:reponame/shot' component={Shot} />
    <IndexRoute component={Home}/>
  </Route>
)
