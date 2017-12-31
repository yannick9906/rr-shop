<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-31
     * Time: 05:11 PM
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Order.php';
    require_once '../../classes/Customer.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    $orderToEdit = \rrshop\Order::fromOrderID($_POST["orderID"]);

    if($orderToEdit->getOrderID() == null) {
        echo json_encode(["success" => false, "error" => "id not found"]);
        exit();
    }

    $orderToEdit->setState($_POST["state"]);
    $orderToEdit->saveChanges();
    echo json_encode(["success" => true]);