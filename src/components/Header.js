import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import RepoSearch from 'components/RepoSearch'

import { refreshAllRepos, refreshTrendingRepos } from 'actions/repos'

if (process.env.BROWSER) { require('styles/Header.scss') }

@connect(
  () => ({}),
  dispatch => bindActionCreators({ refreshAllRepos, refreshTrendingRepos }, dispatch)
)
class Header extends Component {

  render () {
    return (
      <div className='Header'>
        <div className='Header--content'>

          <Link
            to='/'
            onClick={this.props.refreshTrendingRepos}
            style={{ marginRight: '3em' }}>
            {'Starveller'}
          </Link>

          <div className='Header--search'>
            <RepoSearch onSelect={name => {
              console.log(name)
            }} />
          </div>

          <div className='Header--links'>

            <Link
              to='browse'
              onClick={this.props.refreshAllRepos}>
              {'Browse all'}
            </Link>

            <Link to='about'>{'About'}</Link>

          </div>
        </div>
      </div>
    )
  }

}

export default Header
