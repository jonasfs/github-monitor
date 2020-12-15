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
		let oldOffset = this.state.offset;
		let {count} = this.props.data;
		this.setState({offset: newOffset});
		commitAPI.getCommits(author, repo, this.state.limit, newOffset, count);
	}

  componentDidMount() {
		let {author, repo} = this.props.match.params;
		this.setState({author: author, repo: repo});
    commitAPI.getCommits(author, repo);
  }

  componentDidUpdate() {
		let {author, repo} = this.props.match.params;
		if ((author !== this.state.author) || (repo !== this.state.repo) ) {
			this.setState({author: author, repo: repo, offset: 0});
			commitAPI.getCommits(author, repo);
		}
	}

  render() {
		const { limit, offset } = this.state;
		const { loading } = this.props;
		const {count} = this.props.data;
    const commits = this.props.data.results;
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
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = store => ({
  data: store.commitState.data,
  loading: store.commitState.loading,
});

export default connect(mapStateToProps)(CommitListContainer);
