import _ from 'lodash'

export const getReposBoundaries = (repos) => {
  return {
    minStars: 0,
    maxStars: _.max(repos.map(r => r.summary.starsCount)),
    minDate: new Date(_.min(repos.map(r => new Date(r.summary.createdAt).getTime()))),
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
