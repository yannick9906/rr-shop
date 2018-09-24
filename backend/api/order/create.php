<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-10
     * Time: 04:44 PM
     */
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once "../../classes/Order.php";
    require_once "../../classes/Item.php";
    require_once "../../classes/Customer.php";
    require_once "../../classes/PDO_Mysql.php";
    require_once "../../classes/passwords.php";
    require_once "../../classes/User.php";

    $accesscode = $_COOKIE['accesscode'];
    $accesscodes = \rrshop\accesscodes();
    if(!(in_array($accesscode, $accesscodes))) {
        echo json_encode(["success" => false, "error" => "wrong accesscode"]);
        exit;
    }

    $firstname  = $_POST["firstName"];
    $lastname   = $_POST["lastName"];
    $email      = $_POST["email"];
    $note       = $_POST["note"];
    $agbConfirm = $_POST["agbConfirm"];

    $addressStreet  = $_POST["addressStreet"];
    $addressCity    = $_POST["addressCity"];
    $addressZip     = $_POST["addressZip"];

    $payment    = $_POST["payment"];
    $shipping   = $_POST["shipping"];
    $items      = $_POST["items"];

    $customer = \rrshop\Customer::checkEMail($email);
    if(!$customer) $customer = \rrshop\Customer::createNew($firstname, $lastname, $email, $addressCity, $addressStreet, $addressZip);

    $items = \rrshop\Item::checkPriceAndCorrect(json_decode($items, true));
    $totalPrice = \rrshop\Item::getTotalPriceOfItems($items);

    $order = \rrshop\Order::createOrder($customer, $items, $payment, $shipping, $note, $totalPrice);

    if($order != null) echo json_encode(["success" => true, "orderID" => $order->getOrderID(), "orderNum" => $order->getOrderNum(), "orderDate" => date("d. m. Y H:i",$order->getTimestamp()), "totalPrice" => $order->getTotalPrice()]);
    else echo json_encode(["success" => false]);