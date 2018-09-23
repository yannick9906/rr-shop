<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 9/23/2018
     * Time: 11:10 PM
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
    $accesscodes = \rrshop\accesscodes();
    if(!(in_array($accesscode, $accesscodes))) {
        echo json_encode(["success" => false, "error" => "wrong accesscode"]);
        exit;
    }

    $orderID = intval($_GET["orderID"]);
    $securityToken = $_GET["token"];

    //TODO tokens only one time possible
    $order = \rrshop\Order::fromOrderID($orderID);
    if($securityToken != $order->getOrderNum()) {
        echo json_encode(["success" => false, "error" => "wrong security token"]);
        exit;
    }

    $order->saveInvoice();
    $order->sendEmailToCustomer();