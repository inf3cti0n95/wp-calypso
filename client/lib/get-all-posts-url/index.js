/** @format */
/**
 * External dependencies
 */
import { assign, flowRight as compose, get } from 'lodash';

/**
 * Internal dependencies
 */
import route from 'lib/route';

const postTypeRoutes = { page: '/pages', post: '/posts' };

const addBaseUrlToProps = props =>
	assign( {}, props, {
		url: get( postTypeRoutes, props.type, `/types/${ props.type }` ),
	} );

const maybeAppendMyToUrl = props =>
	props.type === 'post' &&
	props.selectedSite &&
	! props.selectedSite.jetpack &&
	! props.selectedSite.single_user_site
		? assign( {}, props, { url: ( props.url += '/my' ) } )
		: props;

const maybeAddSiteFragment = props =>
	props.selectedSite
		? assign( {}, props, {
				url: route.addSiteFragment( props.url, props.selectedSite.slug ),
			} )
		: props;

const getUrl = ( { url } ) => url;

export default compose( getUrl, maybeAddSiteFragment, maybeAppendMyToUrl, addBaseUrlToProps );
