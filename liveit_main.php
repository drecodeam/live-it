<?php
/*
Plugin Name: live it
Plugin URI: http://ankuranand.in/liveit
Description: Customize the look of your blog live.
Version: 0.1
Author: ankur anand
Author URI: http://ankuranand.in
License:GPL2
*/

/*  Copyright 2012  ankur anand  (email : drecodeam@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

//Function to load the stylesheet
function liveit_enqueue_styles(){
		wp_register_style('liveit_main_stylesheet', plugins_url('liveit_main.css', __FILE__));
		wp_enqueue_style( 'liveit_main_stylesheet');
	}


//function to load the scripts
function liveit_enqueue_scripts(){
// embed the main javascript
wp_enqueue_script('liveit_spin',plugins_url('spin.min.js', __FILE__),array('jquery')); 
wp_enqueue_script('liveit_main',plugins_url('liveit_main.js', __FILE__),array('jquery')); 

// declare the URL to the file that handles the AJAX request (wp-admin/admin-ajax.php)
wp_localize_script( 'liveit_main','liveit', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
	}
	// embed the javascript file that makes the AJAX request

        
add_action('wp_print_styles', 'liveit_enqueue_styles');
add_action('wp_print_scripts', 'liveit_enqueue_scripts');
add_action('wp_ajax_nopriv_liveit_save', 'liveit_save');
add_action('wp_ajax_liveit_save', 'liveit_save');
add_action( 'admin_bar_menu', 'toolbar_link_to_mypage', 999 );


	function liveit_save(){

		$EOL='\n\r';
		if(function_exists('json_encode')) {
			//$feedback.='no json help needed'.$EOL;
		} else {
			//$feedback.='json help needed !!'.$EOL;
			/* Untested: if your server has no json support
			if ( ! class_exists('Services_JSON'))
			{
			require_once('../wp-content/plugins/wp-live-css-editor/JSON.php');
			}
			$json = new Services_JSON();

			function json_encode($data = null)
			{
			if($data == null) return false;
			return $json->encode($data);
			}

			function json_decode($data = null)
			{
			if($data == null) return false;
			return $json->decode($data);
			}*/
		}
		$css = $_POST['css'];
		$css=urldecode($css);
		$css=stripslashes($css);
		$path=$_POST['href'];

		// Figure out relative path to file and compose backup uri
		if(strpos($path, '?') > 0)
		$path = substr($path, 0, strpos($path, '?'));
		//$feedback.='$href: '.$_POST['href'].$EOL;
		//$feedback.='$path: '.$path.$EOL;
		//$feedback.='$path: '.$path.$EOL;
		$file = str_replace(get_bloginfo('siteurl').'/','',$path);
		//$feedback.='get_bloginfo("siteurl"): '.get_bloginfo('siteurl').$EOL;
		$feedback.=$file;
		$file='../'.$file;
		//$feedback.='$file: '.$file.$EOL;
		$path_parts = pathinfo($file);
		$date=date("Y-m-d-H-i-s");
		$fileBackup = $path_parts['dirname'].'/'.$path_parts['basename'].'.'.$date.'.bak';
		//$feedback.='$file: '.$file.$EOL;
		//$feedback.='$fileBackup: '.$fileBackup.$EOL;
		//$feedback.='****.*****: '.realpath('.').$EOL;
		//$feedback.='****../wp-content*****: '.realpath('../wp-content').$EOL;

		//copy existing file to dated backup file
		if (!copy($file, $fileBackup)) {
			$jsonEncodedResult = json_encode(array(
				'result' => "failed to copy $file...",
				'feedback' => $feedback
			));
			header( "Content-Type: application/json" );
			die($jsonEncodedResult);
		}

		//save file
		$fh = fopen($file, 'w') or die(json_encode(array(
			'result' => 'Couldnt open file '.$file.' for writing',
			'feedback' => feedback
		)));
		fwrite($fh, $css);
		fclose($fh);

		$jsonEncodedResult = json_encode(array(
			'result' => 'success',
			'feedback' => $feedback
		));
		header( "Content-Type: application/json" );
		echo $jsonEncodedResult;
		exit;
	

		
	}	
	
        
?>
