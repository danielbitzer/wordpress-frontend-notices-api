Wordpress Frontend Notices API
==============================

This is a very simple WordPress plugin for creating frontend notices server side or client side. There are 4 notice types by default <code>success, error, warning, notice</code> but there is no reason you can't add custom types. Server side notices are stored in the session until displayed.

I'd love to see something like this as part of the WordPress core.

###Installation  
I'd suggest adding to mu-plugins

###Server Side
````php
new WP_Frontend_Notice( 'success', 'Document uploaded successfully.' ); 
new WP_Frontend_Notice( $type, $message, $timer, $priority ); 
````

###Client Side
If the <code>scroll_to</code> parameter is true then the window will scroll to the notice.
````javascript
jQuery(document).ready(function($){

  $.WP_Frontend_Notices.success( message, scroll_to, timer, callback );
  $.WP_Frontend_Notices.error( message, scroll_to, timer, callback );
  $.WP_Frontend_Notices.notice( message, scroll_to, timer, callback );
  $.WP_Frontend_Notices.warning( message, scroll_to, timer, callback );
  
  // Custom type
  $.WP_Frontend_Notices.render_notice( type, message, scroll_to, timer, callback );
  
  // Using the callback parameter
  $.WP_Frontend_Notices.warning( 'Invalid form input.', false, 3000, function( $notice ) {
  	console.log( $notice );
  });
  
  
});
````


###Config
Options can be overridden with filter 'frontend_notices_options'
````php
add_filter( 'frontend_notices_options', 'customize_frontend_alerts' );

function customize_frontend_alerts( $options )
{
	$options = array(
		'prepend_selector' => '#content',
		'container_class' => 'notices-container',
		'before_error_message' => '<strong>Error</strong> ',
		'after_error_message' => '',
		'before_success_message' => '<strong>Success</strong> ',
		'after_success_message' => '',
		'before_notice_message' => '<strong>Notice</strong> ',
		'after_notice_message' => '',
		'before_warning_message' => '<strong>Warning</strong> ',
		'after_warning_message' => '',
		'scrolling_speed' => 500,
	);
	return $options;
}
````
