<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 9/20/2018
     * Time: 8:17 PM
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
    $shipAll = $_POST["shipping"]==2;

    $correctedCart = \rrshop\Item::checkPriceAndCorrect(json_decode($items, true));

    echo json_encode(\rrshop\Item::addShipping($correctedCart,$shipAll));