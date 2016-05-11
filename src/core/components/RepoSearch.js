import _ from 'lodash'
import cx from 'classnames'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import searchRepos from 'core/helpers/search-repos'

if (process.env.BROWSER) { require('client/styles/RepoSearch.scss') }

@connect(
  state => ({
    askInProgress: state.loader.ask
  })
)
class RepoSearch extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  static defaultState = {
    results: [],
    loading: false,
    cancelSearch: null,
    err: null,
    selected: 0
  };

  constructor (props) {
    super(props)

    this.debouncedSearch = _.debounce(::this.search, 500)
    this.state = _.clone(RepoSearch.defaultState)
  }

  componentDidMount () {
    if (this.props.autofocus) {
      this.refs.input.focus()
    }
  }

  componentDidUpdate () {
    const { selectedNode, scrollNode } = this
    if (selectedNode && scrollNode) {
      const selectedRect = selectedNode.getBoundingClientRect()
      const scrollRect = scrollNode.getBoundingClientRect()
      const diff = (selectedRect.top + selectedRect.height) - (scrollRect.top + scrollRect.height)
      if (diff > 0) {
        scrollNode.scrollTop += diff
      }
      if (selectedRect.top < scrollRect.top) {
        scrollNode.scrollTop -= scrollRect.top - selectedRect.top
      }
    }
  }

  handleChange (e) {
    const { value } = e.target
    const { loading } = this.state

    // reset all results on input clear
    if (loading && value === '') {
      this.state.cancelSearch()
      return this.setState(_.clone(RepoSearch.defaultState))
    }

    this.debouncedSearch(value)
  }

  handleResulClick (repoName) {
    const { setNameAfterSearch } = this.props
    this.props.onSelect(repoName)
    this.setState(_.clone(RepoSearch.defaultState))
    this.refs.input.value = setNameAfterSearch
      ? repoName
      : ''
  }

  handleKeyDown (e) {

    const { selected, results } = this.state

    const isUp = e.which === 38
    const isDown = e.which === 40
    const isEnter = e.which === 13

    if (isUp && selected > 0) {
      this.setState({ selected: selected - 1 })
    }

    if (isDown && selected < results.length - 1) {
      this.setState({ selected: selected + 1 })
    }

    if (isEnter && results.length) {
      this.handleResulClick(results[selected].name)
    }
  }

  search (value) {
    const { loading } = this.state

    // cancel current search if loading
    if (loading) {
      this.state.cancelSearch()
    }

    // reset all results on input clear
    if (value === '') {
      return this.setState(_.clone(RepoSearch.defaultState))
    }

    // used in cancel closure
    let validResults = true

    this.setState({
      loading: true,
      cancelSearch: () => { validResults = false }
    })

    searchRepos(value)
      .then(results => {
        if (validResults) {
          this.setState({
            ..._.clone(RepoSearch.defaultState),
            results
          })
        }
      })
      .catch(err => {
        this.setState({
          ..._.clone(RepoSearch.defaultState),
          results: [],
          err
        })
      })

  }

  render () {
    const { results, loading, selected } = this.state
    const { askInProgress } = this.props

    return (
      <div className='RepoSearch'>

        <input
          disabled={askInProgress}
          ref='input'
          onChange={::this.handleChange}
          onKeyDown={::this.handleKeyDown}
          placeholder='Search for a repo, user...'
          type='text' />

        {(loading || askInProgress) && (
          <div className='RepoSearch--loader'>
            <span className='octicon octicon-git-commit' />
          </div>
        )}

        {!!results.length && (
          <div className='RepoSearch--results' ref={node => this.scrollNode = node}>
            {results.map(r => {
              const active = r.name === results[selected].name
              const additionnalProps = active
                ? { ref: node => this.selectedNode = node }
                : {}
              return (
                <div
                  key={r.name}
                  {...additionnalProps}
                  onClick={this.handleResulClick.bind(this, r.name)}
                  className={cx('RepoSearch--result', { active })}>

                  <div>
                    <strong>{r.name}</strong>
                    {!!r.desc && (
                      <div className='RepoSearch--desc'>
                        {r.desc}
                      </div>
                    )}
                  </div>

                  <div className='RepoSearch--result-side'>
                    {`${r.stars} `}
                    <span className='octicon octicon-star'></span>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    )
  }

}

export default RepoSearch
