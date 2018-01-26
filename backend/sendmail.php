<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2018-01-17
     * Time: 09:05 PM
     */

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);


    require_once "classes/PDO_Mysql.php";
    require_once "classes/Invoice.php";
    require_once "classes/Customer.php";
    require_once "classes/Item.php";
    require_once "classes/Invoice.php";
    require_once "classes/Order.php";
    require_once "lib/code128.php";
    require_once "lib/fpdf.php";
    require_once "lib/qrcode.class.php";
    require_once "vendor/phpmailer/phpmailer/src/PHPMailer.php";
    require_once "vendor/phpmailer/phpmailer/src/Exception.php";
    require_once "vendor/phpmailer/phpmailer/src/OAuth.php";
    require_once "vendor/phpmailer/phpmailer/src/POP3.php";
    require_once "vendor/phpmailer/phpmailer/src/SMTP.php";
    require_once "classes/Template.php";


    $orderID = $_GET["orderID"];

    $order = \rrshop\Order::fromOrderID($orderID);
    //print_r($orders);

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $template = new \Template();

    $invoice = new \rrshop\Invoice($order->getItems(), $order->getOrderID(), $order->getCustomer(), $order->getNote(), $order->getTimestamp());
    $customer = $order->getCustomer();
    $totalPrice = $invoice->preparePDF();
    $invoice->getPDFAttachment();

    $mail->setFrom("noreply@shop.rheinhessenriders.tk", "RheinhessenRiders Shop");
    $mail->addAddress($customer->getEmail(),$customer->getFirstname()." ".$customer->getLastname());
    $mail->addEmbeddedImage('../img/reimann.jpg', 'reimann');
    $mail->addEmbeddedImage('../img/title.jpg', 'title');
    $mail->addAttachment($orderID."-rechnung.pdf",$orderID."-rechnung.pdf");


    $mail->isHTML(true);
    //Todo add plain text version
    $mail->Subject = "Deine Bestellung #".$orderID." ist eingegangen.";
    $mail->Body    = $template->parse("email.html");
    $mail->AltBody = "";

    $mail->send();