'use strict';

module.exports = {
	app: {
		title: 'MyStore',
		description: 'My local store offers',
		keywords: 'My stores, Local store offers'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/bootstrap-daterangepicker/daterangepicker.css',
			],
			js: [
				'http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',				
				'public/lib/moment/moment.js',
				'public/lib/bootstrap-daterangepicker/daterangepicker.js',
				'public/lib/angular-daterangepicker/js/angular-daterangepicker.js',
				'public/lib/ng-file-upload/ng-file-upload.js',
				'public/lib/ngmap/build/scripts/ng-map.js',
				'public/lib/vsGoogleAutocomplete/dist/vs-google-autocomplete.js',
				'public/lib/vsGoogleAutocomplete/dist/vs-autocomplete-validator.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};