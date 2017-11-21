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

    $firstname = utf8_decode($_POST["firstname"]);
    $lastname = utf8_decode($_POST["lastname"]);
    $email = utf8_decode($_POST["email"]);

    $payment = $_POST["payment"];
    $shipment = $_POST["shipment"];
    $items = $_POST["items"];

    $customer = \rrshop\Customer::checkEMail($email);
    if(!$customer) $customer = \rrshop\Customer::createNew($firstname, $lastname, $email);
    \rrshop\Order::createOrder($customer, $items, $payment, $shipment);

    echo json_encode(["success" => true]);