if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'

import config from 'config'
import StarsEvolution from 'components/graphs/StarsEvolution'
import Clip from 'components/Clip'
import Badge from 'components/Badge'
import { askRepo, setCurrent, refreshRepo, deleteRepo } from 'actions/repos'

@prefetch(({ dispatch, params }) => {
  const { owner, reponame } = params
  return dispatch(askRepo({ name: `${owner}/${reponame}` }))
    .then(repo => dispatch(setCurrent(repo)))
})
@connect(
  state => ({
    repo: state.repos.all[state.repos.current],
    progress: state.loader.progress[state.repos.current] || 0
  })
)
class Repo extends Component {

  renderPlaceholder () {
    return (
      <div></div>
    )
  }

  refreshRepo = (full, e) => {
    e.preventDefault()
    this.props.dispatch(refreshRepo(this.props.repo, full))
  };

  deleteRepo = (e) => {
    e.preventDefault()
    this.props.dispatch(deleteRepo(this.props.repo))
  };

  getBadgeInfos () {
    const { repo } = this.props
    const badgeUrl = `${config.apiUrl}/repos/${repo.name}/badge`
    const markdownBadge = `[![Week Stars](${badgeUrl})](${config.clientUrl}${repo.name})`
    return { badgeUrl, markdownBadge }
  }

  renderLimitError () {
    return (
      <div className='mt3' style={{ color: 'orangered', textAlign: 'center' }}>
        <p className='mb'>{'Due to Github API limitations, repos with more than 40.000 stars will have truncated data.'}</p>
      </div>
    )
  }

  render () {
    const { repo, progress } = this.props

    if (!repo) { return this.renderPlaceholder() }

    const { badgeUrl } = this.getBadgeInfos()

    return (
      <div className='container mt2'>

        <header className='repo-header'>

          <div className='repo-name'>
            <a
              className='repo-name--github'
              target='_blank' href={`https://github.com/${repo.name}`}
              style={{ marginRight: '0.5em' }}>
              <i className='octicon octicon-mark-github' />
            </a>
            {repo.name}
          </div>

          {repo.complete && (
            <div className='f fa'>
              <Clip text={this.getBadgeInfos().markdownBadge} style={{ marginRight: '0.5rem' }} />
              <Badge src={badgeUrl} />
            </div>
          )}

        </header>

        {process.env.NODE_ENV === 'development' && (
          <span>
            <a href='' onClick={this.refreshRepo.bind(this, true)}>{'full refresh'}</a>
            {' - '}
            <a href='' onClick={this.refreshRepo.bind(this, false)}>{'light refresh'}</a>
            {' - '}
            <a href='' onClick={this.deleteRepo}>{'delete'}</a>
          </span>
        )}

        {repo.summary.starsCount > 40000 && this.renderLimitError()}

        <section className='graphs-container'>

          <section className='graph'>
            {!repo.complete
              ? (
                <div>
                  <div className='graph-loader'>
                    <div className='graph-loading-bar' style={{ transform: `scaleX(${progress / 100})` }} />
                    <p>{`${Math.round(progress)} %`}</p>
                  </div>
                </div>
              )
              : <StarsEvolution repo={repo} />}
          </section>

        </section>

      </div>
    )
  }

}

export default Repo
