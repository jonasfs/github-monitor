import * as types from './ActionTypes';

export const createRepositorySuccess = (response, successMessage) => ({
  type: types.CREATE_REPOSITORY_SUCCESS,
  payload: {response, successMessage},
});

export const getCommitsSuccess = (results, count, loading) => ({
  type: types.GET_COMMITS_SUCCESS,
  payload: {results, count, loading},
});

export const getReposSuccess = (results, count, loading, searching) => ({
  type: types.GET_REPOS_SUCCESS,
  payload: {results, count, loading, searching},
});

export const refreshApp = (refresh) => ({
	type: types.REFRESH_APP,
	payload: {refresh},
});
