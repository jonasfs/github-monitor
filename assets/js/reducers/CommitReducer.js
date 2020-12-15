import * as types from '../actions/ActionTypes';

const initialState = {
	data: {count: 0, results: []},
  successMessage: false,
	loading: true,
};

const commitReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMMITS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
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
