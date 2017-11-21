<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-10
     * Time: 04:44 PM
     */

    require_once "../../classes/Order.php";
    require_once "../../classes/Customer.php";
    require_once "../../classes/PDO_Mysql.php";

    $orderID = $_GET["orderID"];
    $order = \rrshop\Order::fromOrderID($orderID);

    echo json_encode($order);

    /*echo json_encode([
        "orderID" => uniqid(),
        "state" => 2,
        "nextClose" => "31.12.",
        "payment" => 0,
        "shipping" => 0
    ]);*/