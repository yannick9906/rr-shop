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
    require_once "../../vendor/phpmailer/phpmailer/src/PHPMailer.php";
    require_once "../../vendor/phpmailer/phpmailer/src/Exception.php";
    require_once "../../vendor/phpmailer/phpmailer/src/OAuth.php";
    require_once "../../vendor/phpmailer/phpmailer/src/POP3.php";
    require_once "../../vendor/phpmailer/phpmailer/src/SMTP.php";

    $firstname = utf8_decode($_POST["firstname"]);
    $lastname = utf8_decode($_POST["lastname"]);
    $email = utf8_decode($_POST["email"]);

    $payment = $_POST["payment"];
    $shipment = $_POST["shipment"];
    $items = $_POST["items"];

    $customer = \rrshop\Customer::checkEMail($email);
    if(!$customer) $customer = \rrshop\Customer::createNew($firstname, $lastname, $email);
    $order = \rrshop\Order::createOrder($customer, $items, $payment, $shipment);

    echo json_encode(["success" => true, "order" => $order]);