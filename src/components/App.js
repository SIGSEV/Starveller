import React, { Component } from 'react'
import { connect } from 'react-redux'

import config from 'config'
import { repoResolved } from 'actions/repos'
import { repoProgress } from 'actions/loader'

import Header from 'components/Header'
import Messages from 'components/Messages'

if (process.env.BROWSER) {
  require('styles/main.scss')
}

@connect()
class App extends Component {

  componentDidMount () {
    const socket = io.connect(`:${config.socketPort}`)

    socket.on('repoFetched', repo => {
      this.props.dispatch(repoResolved(repo))
    })

    socket.on('repoProgress--update', data => {
      this.props.dispatch(repoProgress(data))
    })
  }

  render () {

    return (
      <div className='App'>
        <Header />

        <section>{this.props.children}</section>

        <Messages />

        <footer>
          <div className='credits'>
            {'Made with '}
            <strong>{'vim'}</strong>
            {' by '}
            <a href='https://github.com/SIGSEV' target='_blank'>
              {'SIGSEV'}
            </a>
          </div>
        </footer>
      </div>
    )
  }

}

export default App
