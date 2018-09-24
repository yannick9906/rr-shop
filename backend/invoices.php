<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2018-01-08
     * Time: 03:53 PM
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

    $orders = \rrshop\Order::getListObjects(1,999,"", "", "state = 1 and estDate <= MONTH(CURDATE())+1");
    //print_r($orders);
    foreach ($orders as $order) {
        $invoice = new \rrshop\Invoice($order->getItems(), $order->getOrderID(), $order->getCustomer(), $order->getNote(), $order->getTimestamp());
        $invoice->preparePDF();
        $invoice->getPDFFile();
    }