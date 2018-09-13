<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 9/13/2018
     * Time: 5:19 PM
     */

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once "../../classes/Item.php";
    require_once "../../classes/Customer.php";
    require_once "../../classes/PDO_Mysql.php";

    $pdo = new \rrshop\PDO_MYSQL();

    $stmt = $pdo->queryMulti("select * from rrshop_items");
    $rows = array();
    while($r = $stmt->fetchObject()) {
        array_push($rows, $r);
    }

    echo json_encode($rows);