<?php
/**
 * Plugin Name: Notices API
 * Description: Adds some much needed functionality to display alerts on the front end.
 * Version: 1.0
 * Author: Daniel Bitzer
 * Author URI: http://danielbitzer.com/
 */


/**
 * Class Notices_API
 */
class WP_Notices_API
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
		'before_title' => '<strong>',
		'after_title' => ':</strong> ',
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
		return apply_filters( 'notice_api_options', $this->default_options );
	}


	/**
	 * @return bool|array
	 */
	public function get_notices()
	{
		if ( ! isset( $_SESSION[ 'wp_notices' ] ) ||
			empty( $_SESSION[ 'wp_notices' ] ) )
			return false;

		$notices = $_SESSION[ 'wp_notices' ];

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
		unset( $_SESSION[ 'wp_notices' ] );
	}


	/**
	 *
	 */
	public function load()
	{
		wp_enqueue_style( 'notices_api', $this->url . 'style.css' );

		wp_register_script( 'notices_api', $this->url . 'notices-api.js', array( 'jquery' ) );
		wp_localize_script( 'notices_api', 'notice_options',  $this->get_options() );

		wp_enqueue_script( 'notices_api' );

		if ( ! $this->get_notices() )
			return;

		// Pass data to JS and then remove from the session
		wp_localize_script( 'notices_api', 'notices_api_data',  $this->get_notices() );

		$this->clear_notices();
	}

}

new WP_Notices_API();



/**
 * Class WP_Notice
 *
 * Adds an notice to be displayed on the next page a user views.
 */
class WP_Notices
{
	/**
	 * @param $title
	 * @param $message
	 * @param bool $timer
	 * @param int $priority
	 */
	static function success( $title, $message, $timer = false, $priority = 5 )
	{
		self::custom( 'success', $title, $message, $timer, $priority );
	}


	/**
	 * @param $title
	 * @param $message
	 * @param bool $timer
	 * @param int $priority
	 */
	static function warning( $title, $message, $timer = false, $priority = 5 )
	{
		self::custom( 'warning', $title, $message, $timer, $priority );
	}


	/**
	 * @param $title
	 * @param $message
	 * @param bool $timer
	 * @param int $priority
	 */
	static function error( $title, $message, $timer = false, $priority = 5 )
	{
		self::custom( 'error', $title, $message, $timer, $priority );
	}


	/**
	 * @param $title
	 * @param $message
	 * @param bool $timer
	 * @param int $priority
	 */
	static function general( $title, $message, $timer = false, $priority = 5 )
	{
		self::custom( 'general', $title, $message, $timer, $priority );
	}


	/**
	 * @param $type
	 * @param $title
	 * @param $message
	 * @param bool $timer
	 * @param int $priority
	 */
	static function custom( $type, $title, $message, $timer = false, $priority = 5 )
	{
		// Save alert in queue
		$_SESSION[ 'wp_notices' ][] = array(
			'type' => $type,
			'title' => $title,
			'message' => $message,
			'timer' => $timer,
			'priority' => $priority,
		);
	}
}