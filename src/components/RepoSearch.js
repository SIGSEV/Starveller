import _ from 'lodash'
import cx from 'classnames'
import r from 'superagent'
import React, { Component, PropTypes } from 'react'
import ScrollArea from 'react-scrollbar'

import searchRepos from 'helpers/search-repos'

if (process.env.BROWSER) { require('styles/RepoSearch.scss') }

class RepoSearch extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)

    this.debouncedSearch = _.debounce(::this.search, 500)
    this.state = _.clone(RepoSearch.defaultState)
  }

  static defaultState = {
    results: [],
    loading: false,
    cancelSearch: null,
    err: null,
    selected: 0
  };

  static formatResults = res => {
    return []
  };

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
    this.props.onSelect(repoName)
    this.setState(_.clone(RepoSearch.defaultState))
    this.refs.input.value = ''
  }

  handleKeyDown (e) {

    const { selected, results } = this.state

    switch (e.which) {
      case 38:
        if (selected > 0) {
          this.setState({ selected: selected - 1 })
        }
        break;
      case 40:
        if (selected < results.length - 1) {
          this.setState({ selected: selected + 1 })
        }
        break;
      case 13:
        if (results.length) {
          this.handleResulClick(results[selected].name)
        }
        break;
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

    return (
      <div className='RepoSearch'>

        <input
          ref='input'
          onChange={::this.handleChange}
          onKeyDown={::this.handleKeyDown}
          placeholder='Search for a repo, user...'
          type='text' />

        {loading && (
          <div className='RepoSearch--loader'>
            {'loading...'}
          </div>
        )}

        {!!results.length && (
          <ScrollArea className='RepoSearch--results'>
            {results.map(r => (
              <div
                key={r.name}
                onClick={this.handleResulClick.bind(this, r.name)}
                className={cx('RepoSearch--result', { active: r.name === results[selected].name })}>

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
            ))}
          </ScrollArea>
        )}

      </div>
    )
  }

}

export default RepoSearch
