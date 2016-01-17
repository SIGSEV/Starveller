import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import DaysBars from 'components/graphs/DaysBars'
import RepoSearch from 'components/RepoSearch'
import RepoLink from 'components/RepoLink'

import { fetchTrendingRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) { require('styles/Featured.scss') }

@prefetch(({ dispatch }) => dispatch(fetchTrendingRepos()))
@connect(
  state => ({
    trending: state.repos.trending.map(id => state.repos.all[id])
  })
)
class Home extends Component {

  goToRepo (name) {
    this.props.dispatch(askAndGo({ name }))
  }

  render () {
    const { trending } = this.props

    return (
      <div>
        <div className='HomeMarged'>
          <h1>{'Dig into Github repo\'s popularity'}</h1>
          <h2 className='mb2'>{'See & analyze stars origin in time and more!'}</h2>
          <RepoSearch autofocus onSelect={::this.goToRepo} />
        </div>
        <div className='container mt2'>

          <div className='f mb2'>
            <h2 className='fg'>{'Featured repos'}</h2>
            <Link to='/browse'>{'Browse all'}</Link>
          </div>

          {trending.length >= 4 && (
            <div className='Featured'>

              <div>
                <Feat1 repo={trending[0]} />
              </div>

              <div>
                <Feat1 repo={trending[1]} />
                <Feat1 repo={trending[2]} />
              </div>

              <div>
                <Feat2 repo={trending[3]} />
              </div>

            </div>
          )}

        </div>
      </div>
    )
  }

}

const FeatTitle = ({ repo }) => {
  const [author, name] = repo.name.split('/')
  return (
    <RepoLink repo={repo} className='feat--title mb02'>
      {`${author}/`}
      <strong>{name}</strong>
    </RepoLink>
  )
}

const Feat1 = ({ repo }) => (
  <div className='feat feat-1'>
    <div className='feat-front'>
      <FeatTitle repo={repo} />
      <div className='feat--lang'>{'Javascript'}</div>
    </div>
    <DaysBars stars={[2, 2, 5, 12, 24, 37, 55, 64, 64, 64, 72, 75, 84, 102, 225, 310, 350, 350, 360]} />
  </div>
)

const Feat2 = ({ repo }) => (
  <div className='feat feat-2'>
    <FeatTitle repo={repo} />
    <div className='feat--lang'>{'Javascript'}</div>
  </div>
)

export default Home
