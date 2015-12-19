import React, { Component } from 'react'

if (process.env.BROWSER) { require('styles/main.scss') }

class App extends Component {

  render () {
    return (
      <div className='container'>

        <section>
          {this.props.children}
        </section>

        <footer>
          {'Made with vim by '}
          <a href='https://github.com/SIGSEV' target='_blank'>
            {'SIGSEV'}
          </a>
        </footer>

      </div>
    )
  }

}

export default App
