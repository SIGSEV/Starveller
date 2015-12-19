import React, { Component } from 'react'

class Home extends Component {

  handleSearch (e) {
    e.preventDefault()
  }

  render () {
    return (
      <div>

        <h1>{'Add a 4th dimension to Github stars.'}</h1>

        <form className='f' onSubmit={::this.handleSearch}>
          <input
            autoFocus
            className='repo-search'
            type='text'
            placeholder='Find repository...' />
          <button className='b'>
            {'Show'}
          </button>
        </form>

        <hr />

        <h2>
          {'No idea? '}
          <a href='/browse'>{'Browse all repos'}</a>
          {' or check this awesome selection:'}
        </h2>

        <ul className='collection'>

          <li>
            <div className='repo'>
              <header>
                <a href='https://github.com/SIGSEV/minus' target='_blank'>
                  {'SIGSEV/minus'}
                </a>
              </header>
            </div>
          </li>

          <li>
            <div className='repo'>
              <header>
                <a href='https://github.com/SIGSEV/minus' target='_blank'>
                  {'SIGSEV/minus'}
                </a>
              </header>
            </div>
          </li>

          <li>
            <div className='repo'>
              <header>
                <a href='https://github.com/SIGSEV/minus' target='_blank'>
                  {'SIGSEV/minus'}
                </a>
              </header>
            </div>
          </li>

        </ul>

        <div style={{ textAlign: 'right' }}>
          <a href='/browse'>{'More...'}</a>
        </div>

      </div>
    )
  }

}

export default Home
