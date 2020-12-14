import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';


class CommitListContainer extends React.Component {
  componentDidMount() {
		let {author, repo} = this.props.match.params;
    commitAPI.getCommits(author, repo);
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
