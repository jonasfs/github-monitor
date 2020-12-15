import * as types from '../actions/ActionTypes';

const initialState = {
	results: [],
	count: 0,
  successMessage: false,
	loading: true,
	repoResults: [],
	repoCount: 0,
	repoLoading: true,
	repoSearching: false,
};

const commitReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMMITS_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
        count: action.payload.count,
        loading: action.payload.loading,
      };
    case types.CREATE_REPOSITORY_SUCCESS: {
      return {...state, successMessage: action.payload.successMessage};
    }
    case types.GET_REPOS_SUCCESS:
      return {
        ...state,
        repoResults: action.payload.results,
        repoCount: action.payload.count,
        repoLoading: action.payload.loading,
				repoSearching: action.payload.searching,
      };
    default:
      return state;
  }
};

export default commitReducer;
