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
    require_once "../../classes/Invoice.php";
    require_once "../../classes/Item.php";
    require_once "../../classes/Customer.php";
    require_once "../../classes/PDO_Mysql.php";
    require_once "../../classes/passwords.php";
    require_once "../../classes/Template.php";
    require_once "../../vendor/autoload.php";
    require_once "../../lib/code128.php";
    require_once "../../lib/fpdf.php";
    require_once "../../lib/qrcode.class.php";
    require_once "../../vendor/phpmailer/phpmailer/src/PHPMailer.php";
    require_once "../../vendor/phpmailer/phpmailer/src/Exception.php";
    require_once "../../vendor/phpmailer/phpmailer/src/OAuth.php";
    require_once "../../vendor/phpmailer/phpmailer/src/POP3.php";
    require_once "../../vendor/phpmailer/phpmailer/src/SMTP.php";
    require_once "../../classes/User.php";

    $accesscode = $_COOKIE['accesscode'];
    $accesscodes = [
        "d7a0e8bbb6f212c2089021e908e55a00",
        "e7951509bb52ad752d186a69f79e545c",
        //"bebb4b0a43f3f69a19c0cbd4735b47a7",
        //"40c1585b8d9f3bbb775f506f57a13ac2",
        //"7928bc72b97b69f70d168002cf201fc6",
        "4f3f8169c06c52139d9f432be783c80a"
    ];
    if(!(in_array($accesscode, $accesscodes))) {
        echo json_encode(["success" => false, "error" => "wrong accesscode"]);
        exit;
    }

    $firstname = utf8_decode($_POST["firstname"]);
    $lastname = utf8_decode($_POST["lastname"]);
    $email = utf8_decode($_POST["email"]);

    $payment = $_POST["payment"];
    $addressStreet = $_POST["addressStreet"];
    $addressCity = $_POST["addressCity"];
    $addressZip = $_POST["addressZip"];
    $items = $_POST["items"];
    $note = $_POST["note"];

    $customer = \rrshop\Customer::checkEMail($email);
    if(!$customer) $customer = \rrshop\Customer::createNew($firstname, $lastname, $email, $addressCity, $addressStreet, $addressZip);
    $order = \rrshop\Order::createOrder($customer, $items, $payment, $note);

    echo json_encode(["success" => true, "order" => $order]);