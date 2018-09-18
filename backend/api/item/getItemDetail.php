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

    $pdo = new \rrshop\PDO_MYSQL();
    $itemName = $_GET['itemName'];

    $stmt = $pdo->queryMulti("select * from rrshop_itemFeatures where itemID = (select itemID from rrshop_items where itemName = :itmNme limit 1)",[":itmNme" => $itemName]);
    $rows = array();
    while($r = $stmt->fetchObject()) {
        array_push($rows, $r);
    }

    echo json_encode($rows);