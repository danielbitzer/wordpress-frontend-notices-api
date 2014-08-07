WordPress Notices API
==============================

This is a very simple WordPress plugin for creating frontend notices server side or client side. There are 4 notice types by default *success, error, warning, general* or you can create custom notice types. Server side notices are stored in the session until displayed.

This plugin hopes to one day solve the problem of complex WordPress sites with multiple plugins all having their own Notices that all require styling. 

But for now, the Notices API is useful tool for developers creating custom functionality in their theme.


###Server Side
````php
WP_Notices::success( $title, $message, $timer, $priority ); 
WP_Notices::warning( 'Login Failed', 'You have entered an incorrect Username or password, please try again.'); 
WP_Notices::error(  $title, $message, $timer, $priority ); 
WP_Notices::general(  $title, $message, $timer, $priority ); 
WP_Notices::custom( $type, $title, $message, $timer, $priority ); 
````

###Client Side
If the <code>scroll_to</code> parameter is true then the window will scroll to the notice.
````javascript
jQuery(document).ready(function($){

  $.WP_Notices.success( title,message, scroll_to, timer, callback );
  $.WP_Notices.error( title, message, scroll_to, timer, callback );
  $.WP_Notices.general( title, message, scroll_to, timer, callback );
  $.WP_Notices.warning( title, message, scroll_to, timer, callback );
  
  // Custom type
  $.WP_Notices.render_notice( type, title, message, scroll_to, timer, callback );
  
  // Using the callback parameter
  $.WP_Notices.warning( 'Form Error', 'Invalid form input.', false, 3000, function( $notice ) {
  	console.log( $notice );
  });
  
  
});
````


###Config
Options can be overridden with filter 'notice_api_options'
````php
add_filter( 'notice_api_options', 'customize_notice_options' );

function customize_notice_options( $options )
{
	$options = array(
		'prepend_selector' => '#content',
		'container_class' => 'notices-container',
		'before_title' => '<strong>',
		'after_title' => ':</strong> ',
		'scrolling_speed' => 500,
	);
	return $options;
}
````
