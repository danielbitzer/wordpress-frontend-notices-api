<?php
/**
 * Plugin Name: Frontend Notices API
 * Description: Adds some much need functionality to display alerts on the front end.
 * Version: 1.0
 * Author: Daniel Bitzer
 * Author URI: http://danielbitzer.com/
 */


/**
 * Class Frontend_Notices_API
 */
class Frontend_Notices_API
{

	/**
	 * @var string
	 */
	public $url;


	/**
	 * @var array
	 */
	public $default_options = array(
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


	/**
	 *
	 */
	public function __construct()
	{
		$this->url = plugin_dir_url( __FILE__ );

		add_action('init', array( $this, 'session_start' ), 1);
		add_action( 'wp_enqueue_scripts', array( $this, 'load' ) );
	}


	/**
	 *
	 */
	public function session_start()
	{
		if ( ! session_id() )
			session_start();
	}


	/**
	 * @return array
	 */
	public function get_options()
	{
		return apply_filters( 'frontend_notices_options', $this->default_options );
	}


	/**
	 * @return bool|array
	 */
	public function get_notices()
	{
		if ( ! isset( $_SESSION[ 'wp_frontend_notices' ] ) ||
			empty( $_SESSION[ 'wp_frontend_notices' ] ) )
			return false;

		$notices = $_SESSION[ 'wp_frontend_notices' ];

		usort( $notices, array( $this, 'sort_notices' ) );

		return $notices;
	}


	/**
	 * @param $a
	 * @param $b
	 * @return array
	 */
	public function sort_notices( $a, $b )
	{
		return $a[ 'priority' ] - $b[ 'priority' ];
	}


	/**
	 *
	 */
	public function clear_notices()
	{
		unset( $_SESSION[ 'wp_frontend_notices' ] );
	}


	/**
	 *
	 */
	public function load()
	{
		wp_enqueue_style( 'frontend_notices_api', $this->url . 'style.css' );

		wp_register_script( 'frontend_notices_api', $this->url . 'frontend-notices-api.js', array( 'jquery' ) );
		wp_localize_script( 'frontend_notices_api', 'frontend_notices_options',  $this->get_options() );

		wp_enqueue_script( 'frontend_notices_api' );

		if ( ! $this->get_notices() )
			return;

		// Pass data to JS and then remove from the session
		wp_localize_script( 'frontend_notices_api', 'frontend_notices_data',  $this->get_notices() );

		$this->clear_notices();
	}

}

new Frontend_Notices_API();



/**
 * Class WP_Frontend_Notice
 *
 * Adds an notice to be displayed on the next page a user views.
 */
class WP_Frontend_Notice {

	/**
	 * @param $message string
	 * @param $type string
	 * @param int $priority
	 */
	public function __construct( $message, $type, $priority = 5 )
	{
		// Save alert in queue
		$_SESSION[ 'wp_frontend_notices' ][] = array(
			'message' => $message,
			'type' => $type,
			'priority' => $priority
		);

	}
}