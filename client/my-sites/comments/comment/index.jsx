/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import ReactDom from 'react-dom';
import { get, isUndefined } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import CommentActions from 'my-sites/comments/comment/comment-actions';
import CommentContent from 'my-sites/comments/comment/comment-content';
import CommentHeader from 'my-sites/comments/comment/comment-header';
import QueryComment from 'components/data/query-comment';
import { getSiteComment } from 'state/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

export class Comment extends Component {
	static propTypes = {
		commentId: PropTypes.number,
		isBulkMode: PropTypes.bool,
		isPersistent: PropTypes.bool,
		isSelected: PropTypes.bool,
		refreshCommentData: PropTypes.bool,
		removeFromPersisted: PropTypes.func,
		toggleSelected: PropTypes.func,
		updatePersisted: PropTypes.func,
	};

	static defaultProps = {
		isBulkMode: false,
		isSelected: false,
	};

	state = {
		isEditMode: false,
		isExpanded: false,
	};

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.isBulkMode && ! this.props.isBulkMode ) {
			this.setState( { isExpanded: false } );
		}
	}

	storeCardRef = card => ( this.commentCard = card );

	keyDownHandler = event => {
		const commentHasFocus =
			document &&
			this.commentCard &&
			document.activeElement === ReactDom.findDOMNode( this.commentCard );
		if ( this.state.isEditMode || ( this.state.isExpanded && ! commentHasFocus ) ) {
			return;
		}
		switch ( event.keyCode ) {
			case 32: // space
			case 13: // enter
				event.preventDefault();
				this.toggleExpanded();
				break;
		}
	};

	toggleExpanded = () => {
		if ( ! this.props.isLoading && ! this.state.isEditMode ) {
			this.setState( ( { isExpanded } ) => ( { isExpanded: ! isExpanded } ) );
		}
	};

	render() {
		const {
			commentId,
			commentIsPending,
			isBulkMode,
			isLoading,
			isSelected,
			refreshCommentData,
			removeFromPersisted,
			siteId,
			toggleSelected,
			updatePersisted,
		} = this.props;
		const { isEditMode, isExpanded } = this.state;

		const showActions = isExpanded || ( ! isBulkMode && commentIsPending );

		const classes = classNames( 'comment', {
			'is-bulk-mode': isBulkMode,
			'is-collapsed': ! isExpanded,
			'is-expanded': isExpanded,
			'is-placeholder': isLoading,
			'is-pending': commentIsPending,
		} );

		return (
			<Card
				className={ classes }
				onKeyDown={ this.keyDownHandler }
				ref={ this.storeCardRef }
				tabIndex="0"
			>
				{ refreshCommentData && <QueryComment commentId={ commentId } siteId={ siteId } /> }

				{ ! isEditMode && (
					<div className="comment__detail">
						<CommentHeader
							{ ...{ commentId, isBulkMode, isEditMode, isExpanded, isSelected, toggleSelected } }
							toggleExpanded={ this.toggleExpanded }
						/>

						<CommentContent { ...{ commentId, isExpanded } } />

						{ showActions && (
							<CommentActions
								{ ...{ commentId, isExpanded, removeFromPersisted, updatePersisted } }
							/>
						) }
					</div>
				) }
			</Card>
		);
	}
}

const mapStateToProps = ( state, { commentId } ) => {
	const siteId = getSelectedSiteId( state );
	const comment = getSiteComment( state, siteId, commentId );
	const commentStatus = get( comment, 'status' );
	return {
		commentIsPending: 'unapproved' === commentStatus,
		isLoading: isUndefined( comment ),
		siteId,
	};
};

export default connect( mapStateToProps )( Comment );
