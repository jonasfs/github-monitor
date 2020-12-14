import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';
import { Link } from 'react-router-dom';


class CommitListContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			author:'',
			repo:'',
		}
	}
  componentDidMount() {
		let {author, repo} = this.props.match.params;
		this.setState({author: author, repo: repo});
    commitAPI.getCommits(author, repo);
  }

  componentDidUpdate() {
		let {author, repo} = this.props.match.params;
		if ((author !== this.state.author) || (repo !== this.state.repo) ) {
			this.setState({author: author, repo: repo});
			commitAPI.getCommits(author, repo);
		}
	}

  render() {
    const {commits} = this.props;
		let {author, repo} = this.props.match.params;
		const isHome = (!author && !repo);
    return (
      <div>
				<nav aria-label="breadcrumb" className="breadcrumb-nav">
					<ol className="breadcrumb">
						<li className={"breadcrumb-item"+ (isHome?" active":"")} aria-current="page">
							{ isHome? 'Home' : (
								<Link to="/" >
									Home
								</Link>
							)}
						</li>
						{author? (
							<li className="breadcrumb-item" aria-current="page"> Author </li>
						) : ''}
						{author? (
							<li className="breadcrumb-item active" aria-current="page"> {author} </li>
						) : ''}

						{repo? (
							<li className="breadcrumb-item" aria-current="page"> Repository </li>
						) : ''}
						{repo? (
							<li className="breadcrumb-item active" aria-current="page"> {repo} </li>
						) : ''}
					</ol>
				</nav>
        <CommitList commits={commits} />
      </div>
    );
  }
}

CommitListContainer.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = store => ({
  commits: store.commitState.commits,
});

export default connect(mapStateToProps)(CommitListContainer);
