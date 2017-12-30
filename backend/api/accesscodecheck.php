<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-29
     * Time: 09:41 PM
     */

    $code = $_POST["accesscode"];

    if($code == "4f3f8169c06c52139d9f432be783c80a" or $code == "d7a0e8bbb6f212c2089021e908e55a00") {
        echo json_encode(["success" => "true"]);
        exit();
    }
    echo json_encode(["success" => "false"]);