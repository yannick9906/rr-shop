<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-06
     * Time: 11:12 PM
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once("../../classes/User.php");
    require_once("../../classes/PDO_Mysql.php");

    $user = \rrshop\User::checkSession(true);

    if(isset($_GET["destroy"])) {
        session_destroy();
    }