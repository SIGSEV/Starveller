import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators  } from 'redux'

import { browseRepos } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Header.scss')
}

@connect(
  () => ({}),
  dispatch => bindActionCreators({ browseRepos }, dispatch)
)
class Header extends Component {

  render () {
    return (
      <div className='Header'>
        <div className='container'>
          <div className='Header--content'>
            <div style={{ marginRight: '3em' }}>{'Starveller'}</div>
            <div className='Header--search'>
              <input placeholder='Search for a repo, user...' type='text' />
            </div>
            <div className='Header--links'>
              <a onClick={this.props.browseRepos}>{'Browse all'}</a>
              <a>{'Featured'}</a>
              <a>{'About'}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Header
