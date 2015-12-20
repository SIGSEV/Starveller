import React, { Component } from 'react'

if (process.env.BROWSER) {
  require('styles/main.scss')
  require('react-select/dist/react-select.css')
}

class App extends Component {

  render () {
    return (
      <div className='container'>

        <header>
          <button className='b'>
            <i className='octicon octicon-plus' />
            {'Submit your repo!'}
          </button>
        </header>

        <section>
          {this.props.children}
        </section>

        <footer>
          {'Made with '}
          <strong>{'vim'}</strong>
          {' by '}
          <a href='https://github.com/SIGSEV' target='_blank'>
            {'SIGSEV'}
          </a>
        </footer>

      </div>
    )
  }

}

export default App
