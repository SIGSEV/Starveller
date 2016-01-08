import React, { Component } from 'react'
import { connect } from 'react-redux'

import { repoResolved } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/main.scss')
  require('react-select/dist/react-select.css')
}

@connect()
class App extends Component {

  componentDidMount () {
    const socket = io.connect('http://localhost:3002')

    socket.on('repoFetched', repo => {
      this.props.dispatch(repoResolved(repo))
    })
  }

  render () {
    return (
      <div className='container'>

        <section>
          {this.props.children}
        </section>

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
