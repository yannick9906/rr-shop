<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-22
     * Time: 05:54 PM
     */

    require_once "classes/Template.php";

    $template = new Template();
    $template->assign("orderID", "5a14719dbcdaa");
    echo $template->parse("email.html");