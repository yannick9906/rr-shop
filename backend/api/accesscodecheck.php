<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-29
     * Time: 09:41 PM
     */

    $code = $_POST["accesscode"];
    $accesscodes = [
        "d7a0e8bbb6f212c2089021e908e55a00",
        "e7951509bb52ad752d186a69f79e545c",
        //"bebb4b0a43f3f69a19c0cbd4735b47a7",
        //"40c1585b8d9f3bbb775f506f57a13ac2",
        //"7928bc72b97b69f70d168002cf201fc6",
        "4f3f8169c06c52139d9f432be783c80a"
    ];

    if(in_array($code, $accesscodes)) {
        echo json_encode(["success" => "true"]);
        exit();
    }
    echo json_encode(["success" => "false"]);