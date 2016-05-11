import cx from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import RepoSearch from 'core/components/RepoSearch'

import { askAndGo } from 'core/actions/repos'

if (process.env.BROWSER) { require('client/styles/Header.scss') }

@connect( null, dispatch => bindActionCreators({ askAndGo }, dispatch))
class Header extends Component {

  goToRepo = (name) => {
    this.props.askAndGo({ name })
  }

  render () {
    const { isHome } = this.props

    return (
      <div className={cx('Header', { big: isHome })}>
        <div className='Header--content'>

          <Link to='/' style={{ marginRight: '3em' }}>
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
