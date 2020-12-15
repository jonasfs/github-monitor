import axios from 'axios';
import {reset} from 'redux-form';
import store from '../store';
import {
  createRepositorySuccess, getCommitsSuccess,
} from '../actions/CommitActions';

export const getCommits = (author='', repo='', limit=0, offset=0, oldCount=0) => {
	store.dispatch(getCommitsSuccess({count: oldCount, results: []}, true));
	let baseURL = `/api/commits/?limit=${limit}&offset=${offset}`;
	if (author) {
		baseURL += `&author=${author}`
	}
	if (repo) {
		baseURL += `&repository__name=${repo}`
	}
	axios.get(baseURL)
		.then((response) => {
			store.dispatch(getCommitsSuccess(response.data, false));
		});
}

export const createRepository = (values, headers, formDispatch) => axios.post('/api/repositories/', values, {headers})
  .then((response) => {
    store.dispatch(createRepositorySuccess(response.data, true));
    formDispatch(reset('repoCreate'));
  }).catch((error) => {
    const err = error.response;
    console.log(err);
  });

export const getRepos = (limit=0, offset=0) => {
	let baseURL = `/api/repositories/?limit=${limit}&offset=${offset}`;
	return axios.get(baseURL);
}

export const getReposSearch = value => axios.get(`/api/repositories?search=${value}`);
