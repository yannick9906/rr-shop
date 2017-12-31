<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-12-30
     * Time: 08:29 PM
     */

    require_once "../classes/PDO_Mysql.php";
    require_once "../classes/Order.php";
    require_once "../classes/Customer.php";

    $pdo = new \rrshop\PDO_MYSQL();

    //TODO move all orders state 0 to week+1
    $pdo->query("update db_302476_3.rrshop_orders set estDate = estDate+1 where state = 0");

    //TODO get list w/ all orders state 1

    //TODO make pdf w/ these

    //TODO move all orders state 1 to state 2
    $pdo->query("update db_302476_3.rrshop_orders set state = 2 where state = 1");

