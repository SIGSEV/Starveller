import cx from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import RepoSearch from 'components/RepoSearch'

import { refreshAllRepos, refreshTrendingRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) { require('styles/Header.scss') }

@connect(
  state => ({
    big: state.router.location.pathname === '/'
  }),
  dispatch => bindActionCreators({ refreshAllRepos, refreshTrendingRepos, askAndGo }, dispatch)
)
class Header extends Component {

  goToRepo (name) {
    this.props.askAndGo({ name })
  }

  render () {
    const big = !!this.props.big

    return (
      <div className={cx('Header', { big })}>
        <div className='Header--content'>

          <Link
            to='/'
            onClick={this.props.refreshTrendingRepos}
            style={{ marginRight: '3em' }}>
            {'Starveller'}
          </Link>

          <div className='Header--search'>
            {!big && (
              <RepoSearch onSelect={::this.goToRepo} />
            )}
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
