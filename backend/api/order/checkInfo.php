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
    require_once "../../classes/passwords.php";
    require_once "../../classes/Template.php";
    require_once "../../vendor/autoload.php";


    $orderID = $_GET["orderID"];
    $order = \rrshop\Order::fromOrderID($orderID);
    echo json_encode($order);