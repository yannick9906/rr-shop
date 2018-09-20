<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2018-02-05
     * Time: 12:47 AM
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
    require_once "../../classes/User.php";

    $items = $_POST["items"];

    echo \rrshop\Item::checkPriceAndCorrect($items);