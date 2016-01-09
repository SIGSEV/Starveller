import React, { Component } from 'react'
import { connect } from 'react-redux'

import config from 'config'
import { repoResolved } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/main.scss')
  require('react-select/dist/react-select.css')
}

@connect(
  state => ({
    isShot: state.router.location.pathname.endsWith('/shot')
  })
)
class App extends Component {

  componentDidMount () {
    const socket = io.connect(`http://localhost:${config.socketPort}`)

    socket.on('repoFetched', repo => {
      this.props.dispatch(repoResolved(repo))
    })
  }

  render () {

    const { isShot } = this.props

    return (
      <div className='container'>

        <section>
          {this.props.children}
        </section>

        {!isShot && (
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
        )}

      </div>
    )
  }

}

export default App
