import React from 'react'
import RepoItem from 'components/RepoItem'

export default ({ repos }) => (
  <ul className='collection'>
    {repos.map((repo, i) => (
      <li key={i}>
        <RepoItem repo={repo} />
      </li>
    ))}
  </ul>
)
