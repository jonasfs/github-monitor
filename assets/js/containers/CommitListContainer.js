import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';
import Paginator from '../components/Paginator';
import { Link } from 'react-router-dom';


class CommitListContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			author:'',
			repo:'',
			limit: 10,
			offset: 0,
		}
	}

	getPage = newOffset => {
		let {author, repo} = this.props.match.params;
		let {count} = this.props;
		this.setState({offset: newOffset});
		commitAPI.getCommits(author, repo, this.state.limit, newOffset, count);
	}

  componentDidMount() {
		let {author, repo} = this.props.match.params;
		this.setState({author: author, repo: repo});
    commitAPI.getCommits(author, repo);
  }

  componentDidUpdate(prevProps, prevState) {
		let {author, repo} = this.props.match.params;
		const {refresh} = this.props;

		if ((author !== this.state.author) || (repo !== this.state.repo) ) {
			this.setState({author: author, repo: repo, offset: 0});
			commitAPI.getCommits(author, repo);
		} else if (refresh && (refresh !== prevProps.refresh)) {
			this.getPage(0);
		}

	}

  render() {
		const { limit, offset } = this.state;
		const { loading, count } = this.props;
    const commits = this.props.results;
		const {author, repo} = this.props.match.params;
		const isHome = (!author && !repo);
    return (
      <div className="commit-list-container">
				<nav aria-label="breadcrumb" className="breadcrumb-nav">
					<ol className="breadcrumb">
						<li className={"breadcrumb-item"+ (isHome?" active":"")} aria-current="page">
							{ isHome? 'Home' : (
								<Link to="/" >
									Home
								</Link>
							)}
						</li>
						{author? ([
							<li className="breadcrumb-item" aria-current="page" key="1"> Author </li>,
							<li className="breadcrumb-item active" aria-current="page" key="2"> {author} </li>
						]) : ''}

						{repo? ([
							<li className="breadcrumb-item" aria-current="page" key="1"> Repository </li>,
							<li className="breadcrumb-item active" aria-current="page" key="2"> {repo} </li>
						]) : ''}
					</ol>
				</nav>
				<CommitList
					commits={commits}
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

CommitListContainer.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
};

const mapStateToProps = store => ({
  results: store.commitState.results,
	count: store.commitState.count,
  loading: store.commitState.loading,
  refresh: store.commitState.refresh,
});

export default connect(mapStateToProps)(CommitListContainer);
