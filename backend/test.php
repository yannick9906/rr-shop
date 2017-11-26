<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-22
     * Time: 05:54 PM
     */

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    /*require_once "classes/Template.php";

    $template = new Template();
    $template->assign("orderID", "5a14719dbcdaa");
    echo $template->parse("email.html");*/

    require_once "classes/PDO_Mysql.php";
    require_once "classes/Invoice.php";
    require_once "classes/Customer.php";
    require_once "classes/Item.php";
    require_once "classes/Order.php";
    require_once "lib/code128.php";
    require_once "lib/fpdf.php";
    require_once "lib/qrcode.class.php";

    $i = new \rrshop\Invoice('[{"itemType":1,"amount":1,"itemData":{"frontName":"Furst Gruppenzwerg","city":"mz","size":"s"}}]',uniqid(),\rrshop\Customer::fromCustomerID(1));
    $i->preparePDF();
    $i->showPDF();