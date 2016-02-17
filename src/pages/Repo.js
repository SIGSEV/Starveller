if (process.env.BROWSER) { require('styles/Repo.scss') }

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { prefetch } from 'react-fetcher'
import { Link } from 'react-router'

import config from 'config'
import StarsEvolution from 'components/graphs/StarsEvolution'
import { askRepo, setCurrent, refreshRepo } from 'actions/repos'
import { addMessage } from 'actions/messages'

const Clipboard = process.env.BROWSER
  ? require('clipboard')
  : null

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

  copyToClipboard = (e) => {
    const { markdownBadge } = this.getBadgeInfos()
    const text = () => markdownBadge
    const clipboard = new Clipboard(e.target, { text })
    const destroyClipboard = () => clipboard.destroy()
    clipboard.on('success', () => {
      this.props.dispatch(addMessage({ type: 'info', data: 'Copied!' }))
      destroyClipboard()
    })
    clipboard.on('error', destroyClipboard)
    clipboard.onClick(e)
  };

  renderPlaceholder () {
    return (
      <div></div>
    )
  }

  refreshRepo = (e) => {
    e.preventDefault()
    this.props.dispatch(refreshRepo(this.props.repo))
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
        <p className='mb'>{'Due to Github API limitations, we cannot fetch repo with more than 40.000 stars at the moment.'}</p>
        <p>
          <a href='' target='_blank'>Sign the petition here</a>
          <span className='bullet' />
          <Link to='/'>{'Bring me back'}</Link>
        </p>
      </div>
    )
  }

  render () {
    const { repo, progress } = this.props

    if (!repo) { return this.renderPlaceholder() }
    if (repo.summary.starsCount > 40000) { return this.renderLimitError() }

    const { badgeUrl, markdownBadge } = this.getBadgeInfos()

    return (
      <div className='container mt2'>

        <header className='repo-header'>

          <div className='repo-name'>
            <a target='_blank' href={`https://github.com/${repo.name}`} style={{ marginRight: '0.5em' }}>
              <i className='octicon octicon-mark-github' />
            </a>
            {repo.name}
            {process.env.NODE_ENV === 'development' && (
              <span>
                {' - '}
                <a href='' onClick={this.refreshRepo}>{'refresh'}</a>
              </span>
            )}
          </div>

          <div className='f'>
            <img src={badgeUrl} />
            <button onClick={this.copyToClipboard} style={{ marginLeft: '0.5rem' }}>
              <span className='octicon octicon-clippy' />
            </button>
          </div>

        </header>

        <section className='graphs-container'>

          <section className='graph'>
            {!repo.complete
              ? (
                <div>
                  <div className='graph-loader'>
                    <span className='mega-octicon octicon-sync' />
                    <p>{progress}{' %'}</p>
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
