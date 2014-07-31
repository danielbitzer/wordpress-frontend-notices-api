jQuery(document).ready(function($){

	$.WP_Notices = {


		/**
		 * Ok to render notices?
		 * @var bool
		 */
		check_passed: true,


		/**
		 * @var object
		 */
		options: {},


		/**
		 * @var jQuery element
		 */
		$prepend_element: '',


		/**
		 * @var jQuery element
		 */
		$notices_container: '',


		/**
		 * Initialise
		 */
		init: function() {

			// Check everyhing is working
			if ( ! this.check() ) {
				this.check_passed = false;
				return;
			}

			this.options = notice_options;
			this.$prepend_element = $( this.options.prepend_selector );

			// Insert container
			this.$prepend_element.prepend( '<div class="' + this.options.container_class + ' empty">' );
			this.$notices_container = $( this.$prepend_element.find( '.' + this.options.container_class ) );

			this.render_from_session();
			this.bind_close();

		},


		/**
		 * @returns boolean
		 */
		check: function() {

			// Check we have parameters object
			if ( typeof notice_options == 'undefined' ) {
				console.log( 'Missing Notices parameters object.' );
				return false;
			}

			// Check we have somewhere to put our notices
			if ( ! $( notice_options.prepend_selector ).length ) {
				console.log( 'Notices prepend element not found.' );
				return false;
			}

			return true;
		},


		/**
		 * Render any notices stored in session
		 */
		render_from_session: function() {

			if ( typeof notices_api_data == 'undefined' ) {
				return;
			}

			for ( i in notices_api_data )
			{
				var notice = notices_api_data[i];

				this.render_notice(
					notice.type,
					notice.title,
					notice.message,
					false,
					notice.timer
				);
			}

		},


		/**
		 * @param message
		 * @param type
		 * @param scroll_to
		 * @param timer
		 * @param callback
		 */
		render_notice: function( type, title, message, scroll_to, timer, callback ) {

			var before_message,
				after_message,
				notice_html,
				$notice;

			if ( ! this.check_passed ) {
				return;
			}

			// Format notice
			notice_html = '<div class="notice ' + type + ' ">'
				+ '<span class="message">'
				+ this.options.before_title + title + this.options.after_title
				+ message
				+ '</span>'
				+ '<span class="close">Close</span>'
				+ '</div>';

			this.$notices_container.prepend( notice_html );

			// Add a visible class for CSS transitions
			$notice = this.$notices_container.find( '.notice').first();
			$notice.addClass( 'visible' );

			if ( scroll_to !== false ) {
				this.scroll_to_notices();
			}

			this.check_for_visible_notices();

			// Remove after time
			if ( timer ) {
				setTimeout(function() {
					$notice.removeClass( 'visible' );
					$.WP_Notices.check_for_visible_notices();
				}, timer );
			}

			if ( callback ) {
				callback( $notice );
			}


		},




		/**
		 * @param message
		 * @param scroll_to
		 * @param timer
		 * @param callback
		 */
		success: function( title, message, scroll_to, timer, callback ) {

			this.render_notice( 'success', title, message, scroll_to, timer, callback );

		},


		/**
		 * @param message
		 * @param scroll_to
		 * @param timer
		 * @param callback
		 */
		general: function( title, message, scroll_to, timer, callback ){

			this.render_notice( 'general', title, message, scroll_to, timer, callback );

		},


		/**
		 * @param message
		 * @param scroll_to
		 * @param timer
		 * @param callback
		 */
		error: function( title, message, scroll_to, timer, callback ) {

			this.render_notice( 'error', title, message, scroll_to, timer, callback );

		},


		/**
		 * @param message
		 * @param scroll_to
		 * @param timer
		 * @param callback
		 */
		warning: function( title, message, scroll_to, timer, callback ) {

			this.render_notice( 'warning', title, message, scroll_to, timer, callback );
		},


		/**
		 *
		 */
		scroll_to_notices: function() {

			if ( this.scrolling )
				return;

			this.scrolling = true;

			$( 'html, body' ).animate(
				{
					scrollTop: this.$notices_container.offset().top - 20
				},
				this.options.scrolling_speed,
				function(){
					$.WP_Notices.scrolling = false;
				}
			);

		},


		/**
		 *
		 */
		bind_close: function() {

			$(document).on( 'click', '.' + this.options.container_class + ' .close', function(){
				$(this).parents( '.notice' ).removeClass( 'visible' );
				$.WP_Notices.check_for_visible_notices();
			});

		},


		/**
		 *
		 */
		check_for_visible_notices: function() {

			if ( this.$notices_container.find( '.notice.visible' ).length ) {
				this.$notices_container.removeClass( 'empty' );
			}
			else {
				this.$notices_container.addClass( 'empty' );
			}

		},


		/**
		 * Remove all notices
		 */
		clear: function() {
			this.$notices_container.find( '.notice' ).removeClass( 'visible' );
			this.$notices_container.addClass( 'empty' );
		}

	}

	$.WP_Notices.init();

});