import _ from 'lodash'

export const getReposBoundaries = (repos) => {
  return {
    minStars: 0,
    maxStars: _.max(repos, repo => repo.summary.starsCount).summary.starsCount,
    minDate: new Date(_.min(repos, repo => new Date(repo.summary.createdAt).getTime()).summary.createdAt),
    maxDate: new Date()
  }
}

export const getBars = (repo, n) => {
  if (!repo.stars || !repo.stars.byDay) { return }

  const out = _.reduce(repo.stars.byDay, (res, e) => {
    if (res.length === n) { return res }
    return [...res, e.stars]
  }, [])

  for (let i = out.length; i < n; ++i) { out.unshift(0) }
  return out
}

export const reduceStars = (stars, maxSlices = 30) => {
  return 5
}
