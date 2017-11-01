/**
 * External dependencies
 */
import { disableNetConnect } from 'nock';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// It disables all network requests for all tests.
disableNetConnect();

// configure enzyme for React 16
// from docs: http://airbnb.io/enzyme/docs/installation/index.html
configure( { adapter: new Adapter() } );

// It "mocks" enzyme, so that we can delay loading of
// the utility functions until enzyme is imported in tests.
// Props to @gdborton for sharing this technique in his article:
// https://medium.com/airbnb-engineering/unlocking-test-performance-migrating-from-mocha-to-jest-2796c508ec50.
let mockEnzymeSetup = false;

jest.mock( 'enzyme', () => {
	const chai = require( 'chai' );

	const actualEnzyme = require.requireActual( 'enzyme' );
	if ( ! mockEnzymeSetup ) {
		const chaiEnzyme = require( 'chai-enzyme' );
		if ( typeof chaiEnzyme === 'function' && ! mockEnzymeSetup ) {
			mockEnzymeSetup = true;
			chai.use( chaiEnzyme() );
		}
	}
	return actualEnzyme;
} );

// It "mocks" sinon, so that we can delay loading of
// the utility functions until sinon is imported in tests.
let mockSinonSetup = false;

jest.mock( 'sinon', () => {
	const chai = require( 'chai' );

	const actualSinon = require.requireActual( 'sinon' );
	if ( ! mockSinonSetup ) {
		const sinonChai = require.requireActual( 'sinon-chai' );
		if ( typeof sinonChai === 'function' && ! mockSinonSetup ) {
			mockSinonSetup = true;
			chai.use( sinonChai );
			actualSinon.assert.expose( chai.assert, { prefix: '' } );
		}
	}
	return actualSinon;
} );
