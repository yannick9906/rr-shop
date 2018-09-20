<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 9/15/2018
     * Time: 3:44 PM
     */


    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once "../../classes/Item.php";
    require_once "../../classes/Customer.php";
    require_once "../../classes/PDO_Mysql.php";

    $itemName = $_GET['itemName'];

    echo json_encode(\rrshop\Item::getItemFeatures($itemName));