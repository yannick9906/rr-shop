<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:36
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    $username = $_POST["username"];
    $passhash = $_POST["passhash"];
    $email = $_POST["email"];

    if(!\rrshop\User::doesUserNameExist($username)) {
        if($username != "" && $passhash != "" && $email) {
            \rrshop\User::createUser($username, $passhash, $email);
            echo json_encode(["success" => "1"]);
        } else  echo json_encode(["success" => "0", "error" => "missing fields"]);
    } else  echo json_encode(["success" => "0", "error" => "username exists"]);