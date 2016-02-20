import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import RepoSearch from 'components/RepoSearch'
import { Feat1, Feat2 } from 'components/Featured'

import { fetchFeaturedRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) { require('styles/Featured.scss') }

@prefetch(({ dispatch }) => dispatch(fetchFeaturedRepos()))
@connect(
  state => ({
    featured: state.repos.featured.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  goToRepo (name) {
    this.props.dispatch(askAndGo({ name }))
  }

  render () {
    const { featured } = this.props

    return (
      <div>
        <div className='HomeMarged'>
          <h1>{'Dig into Github repo\'s popularity'}</h1>
          <h2 className='mb2'>{'See & analyze stars origin in time and more!'}</h2>
          <RepoSearch onSelect={::this.goToRepo} setNameAfterSearch />
        </div>
        <div className='container mt2'>

          <div className='f mb2'>
            <h2 className='fg'>{'Featured repos'}</h2>
            <Link to='battle'>{'Battle'}</Link>
          </div>

          <div className='Featured'>

            <div>
              <Feat1 repo={featured[0]} />
            </div>

            <div>
              <Feat1 repo={featured[1]} />
              <Feat1 repo={featured[2]} />
            </div>

            <div>
              <Feat2 repo={featured[3]} />
            </div>

          </div>

        </div>
      </div>
    )
  }

}

export default Home
