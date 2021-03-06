/**
 * @format
 */

/**
 * External Dependencies
 */
import { merge } from 'lodash';
import { translate } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import { READER_CONVERSATION_MUTE } from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { errorNotice, plainNotice } from 'state/notices/actions';
import { updateConversationFollowStatus } from 'state/reader/conversations/actions';
import { bypassDataLayer } from 'state/data-layer/utils';

export function requestConversationMute( { dispatch }, action ) {
	const actionWithRevert = merge( {}, action, {
		meta: {
			// @todo once we've added convo follow to Redux state, use selector to get previous state
			// hardcoded for the moment to support tests
			previousState: 'F',
		},
	} );
	dispatch(
		http(
			{
				method: 'POST',
				apiNamespace: 'wpcom/v2',
				path: `/read/sites/${ action.payload.siteId }/posts/${ action.payload.postId }/mute`,
				body: {}, // have to have an empty body to make wpcom-http happy
			},
			actionWithRevert
		)
	);
}

export function receiveConversationMute( store, action, response ) {
	// validate that it worked
	const isMuting = !! ( response && response.success );
	if ( ! isMuting ) {
		receiveConversationMuteError( store, action );
		return;
	}

	store.dispatch(
		plainNotice( translate( 'The conversation has been successfully unfollowed.' ), {
			duration: 5000,
		} )
	);
}

export function receiveConversationMuteError(
	{ dispatch },
	{ payload: { siteId, postId }, meta: { previousState } }
) {
	dispatch(
		errorNotice(
			translate( 'Sorry, we had a problem unfollowing that conversation. Please try again.' )
		)
	);

	dispatch(
		bypassDataLayer(
			updateConversationFollowStatus( {
				siteId,
				postId,
				followStatus: previousState,
			} )
		)
	);
}

export default {
	[ READER_CONVERSATION_MUTE ]: [
		dispatchRequest(
			requestConversationMute,
			receiveConversationMute,
			receiveConversationMuteError
		),
	],
};
