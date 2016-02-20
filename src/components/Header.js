import cx from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import RepoSearch from 'components/RepoSearch'

import { refreshAllRepos, refreshFeaturedRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) { require('styles/Header.scss') }

@connect(
  state => ({
    isHome: state.router && state.router.location.pathname === '/'
  }),
  dispatch => bindActionCreators({ refreshAllRepos, refreshFeaturedRepos, askAndGo }, dispatch)
)
class Header extends Component {

  goToRepo = (name) => {
    this.props.askAndGo({ name })
  }

  render () {
    const { isHome } = this.props

    return (
      <div className={cx('Header', { big: isHome })}>
        <div className='Header--content'>

          <Link
            to='/'
            onClick={this.props.refreshFeaturedRepos}
            style={{ marginRight: '3em' }}>
            {'Starveller'}
          </Link>

          <div className='Header--search'>
            {!isHome && (
              <RepoSearch onSelect={this.goToRepo} setNameAfterSearch />
            )}
          </div>

          <div className='Header--links'>

            <Link to='battle'>
              <strong>{'Compare'}</strong>
            </Link>

          </div>
        </div>
      </div>
    )
  }

}

export default Header
