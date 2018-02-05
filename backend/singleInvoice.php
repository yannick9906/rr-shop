<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2018-01-16
     * Time: 12:49 PM
     */

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once "classes/PDO_Mysql.php";
    require_once "classes/Invoice.php";
    require_once "classes/Customer.php";
    require_once "classes/Item.php";
    require_once "classes/Order.php";
    require_once "lib/code128.php";
    require_once "lib/fpdf.php";
    require_once "lib/qrcode.class.php";

    $order = \rrshop\Order::fromOrderID($_GET["orderID"]);
    //print_r($orders);
    $invoice = new \rrshop\Invoice($order->getItems(), $order->getOrderID(), $order->getCustomer(), $order->getNote(), $order->getTimestamp());
    $invoice->preparePDF();
    $invoice->showPDF();