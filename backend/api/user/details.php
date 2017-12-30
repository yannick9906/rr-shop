<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:05
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    if(intval($_GET["id"]) == -1)
        $userToEdit = $user;
    else
        $userToEdit = \rrshop\User::fromUID(intval($_GET["id"]));

    if($userToEdit->getUID() != null)
        echo json_encode($userToEdit);
    else
        echo json_encode(["error" => "ID unknown"]);