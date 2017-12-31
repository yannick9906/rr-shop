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

    if(intval($_POST["id"]) == -1)
        $userToEdit = $user;
    else
        $userToEdit = \rrshop\User::fromUID(intval($_POST["id"]));

    if($userToEdit->getUName() == '' or $userToEdit->getUName() == null) {
        echo json_encode(["success" => "false", "error" => "user not found"]);
        exit();
    }

    if(isset($_POST["passhash"])) $userToEdit->setUPassHash($_POST["passhash"]);
    if(isset($_POST["email"])) $userToEdit->setUEmail($_POST["email"]);
    if(isset($_POST["emailNotify"])) $userToEdit->setEmailNotify($_POST["emailNotify"]=="true");

    $userToEdit->saveChanges();
    echo json_encode(["success" => true]);