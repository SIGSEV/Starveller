import React, { Component } from 'react'
import { connect } from 'react-redux'

if (process.env.BROWSER) {
  require('styles/main.scss')
  require('react-select/dist/react-select.css')
}

@connect(
  state => ({
    loading: state.loader.global
  })
)
class App extends Component {

  render () {
    const { loading } = this.props

    return (
      <div className='container' style={{ background: loading ? 'rgba(0, 0, 0, 0.1)' : 'transparent' }}>

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
