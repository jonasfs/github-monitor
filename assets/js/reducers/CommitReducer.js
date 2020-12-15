import * as types from '../actions/ActionTypes';

const initialState = {
	results: [],
	count: 0,
  successMessage: false,
	loading: true,
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
    default:
      return state;
  }
};

export default commitReducer;
