<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-04-25
     * Time: 02:34 AM
     */
    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once "../../classes/PDO_Mysql.php";
    require_once "../../classes/User.php";
    require_once "../../vendor/autoload.php";

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_Mysql();

    $endpoint = json_decode($_POST["endpoint"]);
    $user->addEndpoint($endpoint);
    $user->saveChanges();