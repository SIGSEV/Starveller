import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators  } from 'redux'
import { Link } from 'react-router'

import { fetchAllRepos } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Header.scss')
}

@connect(
  () => ({}),
  dispatch => bindActionCreators({ fetchAllRepos }, dispatch)
)
class Header extends Component {

  render () {
    return (
      <div className='Header'>
        <div className='Header--content'>
          <Link to='/' style={{ marginRight: '3em' }}>{'Starveller'}</Link>
          <div className='Header--search'>
            <input placeholder='Search for a repo, user...' type='text' />
          </div>
          <div className='Header--links'>
            <Link to='browse' onClick={this.props.fetchAllRepos}>{'Browse all'}</Link>
            <Link to='about'>{'About'}</Link>
          </div>
        </div>
      </div>
    )
  }

}

export default Header
