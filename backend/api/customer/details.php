<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:05
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Customer.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    $customerToView = \rrshop\Customer::fromCustomerID(intval($_GET["id"]));

    if($customerToView->getCustomerID() != null)
        echo json_encode($customerToView);
    else
        echo json_encode(["success" => false, "error" => "ID unknown"]);