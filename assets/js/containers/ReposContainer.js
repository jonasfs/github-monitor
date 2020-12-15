import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import RepoList from '../components/RepoList';
import * as commitAPI from '../api/CommitAPI';
import store from '../store';

class ReposContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		commitAPI.getRepos();
	}

	render() {
		const repos = this.props.results;
		return (
			<div>
				<RepoList
					showCommitCount
					repos={repos}
				/>
			</div>
		)
	}
}

ReposContainer.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = store => ({
  results: store.commitState.repoResults,
});
export default connect(mapStateToProps)(ReposContainer);
