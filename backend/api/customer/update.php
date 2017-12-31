<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 04.10.2016
     * Time: 22:36
     */

    ini_set("display_errors", "on");
    error_reporting(E_ALL & ~E_NOTICE);

    require_once '../../classes/PDO_Mysql.php'; //DB Anbindung
    require_once '../../classes/User.php';
    require_once '../../classes/Customer.php';

    $user = \rrshop\User::checkSession();
    $pdo = new \rrshop\PDO_MYSQL();

    $customerToEdit = \rrshop\Customer::fromCustomerID(intval($_POST["id"]));

    if($customerToEdit->getCustomerID() == null) {
        echo json_encode(["success" => false, "error" => "customer not found"]);
        exit();
    }

    if(isset($_POST["firstname"])) $customerToEdit->setFirstname($_POST["firstname"]);
    if(isset($_POST["lastname"])) $customerToEdit->setLastname($_POST["lastname"]);
    if(isset($_POST["email"])) $customerToEdit->setEmail($_POST["email"]);
    if(isset($_POST["addressCity"])) $customerToEdit->setAddressCity($_POST["addressCity"]);
    if(isset($_POST["addressZip"])) $customerToEdit->setAddressZip($_POST["addressZip"]);
    if(isset($_POST["addressStreet"])) $customerToEdit->setAddressStreet($_POST["addressStreet"]);

    $customerToEdit->saveChanges();
    echo json_encode(["success" => true]);