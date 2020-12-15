import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import RepoSearchBar from '../components/RepoSearchBar';
import RepoList from '../components/RepoList';
import Paginator from '../components/Paginator';
import * as commitAPI from '../api/CommitAPI';
import store from '../store';

class RepoListContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeoutID: null,
			search: "",
			limit: 10,
			offset: 0,
		}
	}

	searchBarChange = value => {
		let {limit} = this.state;
		const waitSeconds = 1;
		clearTimeout(this.state.timeoutID);
		let timeout = setTimeout(() => {
			commitAPI.getRepos(limit, 0, 0, value);
		}, waitSeconds * 1000);
		this.setState({search: value, timeoutID: timeout});
	}

	getPage = newOffset => {
		let {search, limit} = this.state;
		let { count } = this.props;
		this.setState({offset: newOffset});
		commitAPI.getRepos(limit, newOffset, count, search);
	}

	componentDidUpdate(prevProps, prevState) {
		const {refresh} = this.props;
		if (refresh && (refresh !== prevProps.refresh)) {
			this.getPage(0);
		}
	}

	componentDidMount() {
		commitAPI.getRepos();
	}

	render() {
		const {search, offset, limit} = this.state;
		const { loading, count, searching } = this.props;
		const repos = this.props.results;
		return (
			<div>
				<RepoSearchBar searchBarChange={this.searchBarChange} />
				<RepoList
					repos={repos}
					search={search}
					loading={loading}
					searching={searching}
					paginator={
						<Paginator
							getPage={this.getPage}
							offset={offset}
							limit={limit}
							count={count}
							loading={loading}
						/>
					}
				/>
			</div>
		);
	}
}

RepoListContainer.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  searching: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
};

const mapStateToProps = store => ({
  results: store.commitState.repoResults,
	count: store.commitState.repoCount,
  loading: store.commitState.repoLoading,
  searching: store.commitState.repoSearching,
  refresh: store.commitState.refresh,
});

export default connect(mapStateToProps)(RepoListContainer);
