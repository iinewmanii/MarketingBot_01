'use strict';

module.exports = {
    kitchen_timer_query: {
		q: '("kitchen timer" OR (kitchen AND timer)) AND android)',
		result_type: 'recent',
		lang: 'en',
		count: '10',
	},

	hashtag_pastry_query: {
		q: '#pastry',
		result_type: 'recent',
		count: '16',
	},

	hashtag_baking_query: {
		q: '#baking',
		result_type: 'recent',
		count: '50',
	},

	android_app_review_query: {
		q: 'android AND app AND review',
		result_type: 'recent',
		count: '50'
	},
} 