import axios from 'axios';
import {reset} from 'redux-form';
import store from '../store';
import {
  createRepositorySuccess, getCommitsSuccess,
	getReposSuccess, refreshApp,
} from '../actions/CommitActions';

export const getCommits = (author='', repo='', limit=0, offset=0, oldCount=0) => {
	store.dispatch(getCommitsSuccess([], oldCount, true));
	let baseURL = `/api/commits/?limit=${limit}&offset=${offset}`;
	if (author) {
		baseURL += `&author=${author}`
	}
	if (repo) {
		baseURL += `&repository__name=${repo}`
	}
	axios.get(baseURL)
		.then((response) => {
			store.dispatch(getCommitsSuccess(response.data.results, response.data.count, false));
		});
}

export const getRepos = (limit=0, offset=0, oldCount=0, search='') => {
	store.dispatch(getReposSuccess([], oldCount, true, (search? true : false)));
	let baseURL = `/api/repositories/?search=${search}&limit=${limit}&offset=${offset}`;
	axios.get(baseURL)
		.then((response) => {
			store.dispatch(getReposSuccess(response.data.results, response.data.count, false, false));
		});
}

export const createRepository = (values, headers, formDispatch) => {
	axios.post('/api/repositories/', values, {headers})
		.then((response) => {
			store.dispatch(refreshApp(true));
			formDispatch(reset('repoCreate'));
		}).catch((error) => {
			const err = error.response;
			console.log(err);
		});
}
