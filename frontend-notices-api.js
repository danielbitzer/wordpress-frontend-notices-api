jQuery(document).ready(function($){

	$.WP_Frontend_Notices = {


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

			this.options = frontend_notices_options;
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
			if ( typeof frontend_notices_options == 'undefined' ) {
				console.log( 'Missing Frontend notices parameters object.' );
				return false;
			}

			// Check we have somewhere to put our notices
			if ( ! $( frontend_notices_options.prepend_selector ).length ) {
				console.log( 'Frontend notices prepend element not found.' );
				return false;
			}

			return true;
		},


		/**
		 * Render any notices stored in session
		 */
		render_from_session: function() {

			if ( typeof frontend_notices_data == 'undefined' ) {
				return;
			}

			for ( i in frontend_notices_data )
			{
				var frontend_notice = frontend_notices_data[i];

				this.render_notice( frontend_notice.message,
					frontend_notice.type,
					false
				);
			}

		},


		/**
		 * @param message {string}
		 * @param type {string}
		 * @param scroll_to {bool} Default: true
		 */
		render_notice: function( message, type, scroll_to ) {

			var before_message,
				after_message,
				notice_html;

			if ( ! this.check_passed ) {
				return;
			}

			switch ( type ) {

				case 'success':
					before_message = this.options.before_success_message;
					after_message = this.options.after_success_message;
					break;

				case 'warning':
					before_message = this.options.before_warning_message;
					after_message = this.options.after_warning_message;
					break;

				case 'error':
					before_message = this.options.before_error_message;
					after_message = this.options.after_error_message;
					break;

				case 'notice':
					before_message = this.options.before_notice_message;
					after_message = this.options.after_notice_message;
					break;
			}


			// Format notice
			notice_html = '<div class="notice ' + type + ' ">'
				+ '<span class="message">'
				+ before_message + message + after_message
				+ '</span>'
				+ '<span class="close">Close</span>'
				+ '</div>';

			this.$notices_container.prepend( notice_html );

			// Add a visible class for CSS transitions
			this.$notices_container.find( '.notice').first().addClass( 'visible' );

			if ( scroll_to !== false ) {
				this.scroll_to_notices();
			}

			this.check_for_visible_notices();

		},




		/**
		 * @param message
		 * @param scroll_to
		 */
		success: function( message, scroll_to ) {

			this.render_notice( message, 'success', scroll_to );

		},


		/**
		 * @param message
		 * @param scroll_to
		 */
		notice: function( message, scroll_to ){

			this.render_notice( message, 'notice', scroll_to );

		},


		/**
		 * @param message
		 * @param scroll_to
		 */
		error: function( message, scroll_to ) {

			this.render_notice( message, 'error', scroll_to );

		},


		/**
		 * @param message
		 * @param scroll_to
		 */
		warning: function( message, scroll_to ) {

			this.render_notice( message, 'warning', scroll_to );
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
					$.WP_Frontend_Notices.scrolling = false;
				}
			);

		},


		/**
		 *
		 */
		bind_close: function() {

			$(document).on( 'click', '.' + this.options.container_class + ' .close', function(){
				$(this).parents( '.notice' ).removeClass( 'visible' );
				$.WP_Frontend_Notices.check_for_visible_notices();
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

		}

	}

	$.WP_Frontend_Notices.init();

});