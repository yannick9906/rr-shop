<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 29.09.2016
     * Time: 19:53
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Order.php';
    require_once '../../classes/Customer.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    $customers = \rrshop\Customer::getList($_GET["page"], intval($_GET["pagesize"]), utf8_decode($_GET["search"]), $_GET["sort"]);
    echo json_encode($customers);