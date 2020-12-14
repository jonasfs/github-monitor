import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';


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
    return (
      <div>
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
