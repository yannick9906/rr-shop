<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-29
     * Time: 09:41 PM
     */

    //header('Content-Type: text/json');

    require_once "../classes/passwords.php";

    $code = $_POST["accesscode"];
    $accesscodes = \rrshop\accesscodes();

    if(in_array($code, $accesscodes)) {
        echo json_encode(["success" => true]);
        exit();
    }
    echo json_encode(["success" => false]);