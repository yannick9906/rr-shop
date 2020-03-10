<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-22
     * Time: 05:54 PM
     */

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require_once "classes/PDO_Mysql.php";
    require_once "classes/Invoice.php";
    require_once "classes/Customer.php";
    require_once "classes/Item.php";
    require_once "classes/Order.php";
    require_once "lib/code128.php";
    //require_once "lib/qrcode.class.php";

    /**
     * @param $pdf   FPDF
     * @param $order \rrshop\Order
     * @param $color
     */
    function item($pdf, $order, $color) {
        $startY = $pdf->getY();
        //Items
        $pdf->setX(100);
        $pdf->setFillColor($color);
        $items = json_decode(utf8_encode($order->getItems()),true);
        for ($j=0; $j < sizeof($items); $j++) {
                $itemType = \rrshop\Item::getItemByID($items[$j]["itemType"]);
                $tstartY = $pdf->getY();
                $pdf->setX(100);
                $pdf->SetFont("","B",11);
                $pdf->Cell(100,5,utf8_decode($itemType->getInvoiceName()." ".$items[$j]["amount"]*$itemType->getBaseAmount()."x"),0,1,'L',true);
                $pdf->SetFont("Courier","B",8);
                $pdf->setX(100);
                $pdf->MultiCell(100,10/3,utf8_decode($itemType->itemDataToInvoice($items[$j],3, "; Anzahl: ".$items[$j]["amount"])),0,"L",true);
                $pdf->SetFont("Arial","",11);

                if($pdf->getY() < $tstartY+15 and sizeof($items)<2) $pdf->setY($startY+15);
                $tendY = $pdf->getY();
                $pdf->setXY(90, $tstartY);
                $pdf->SetFont("","");
                $pdf->Cell(10,5,$j+1,0,1,'C',true);
                $pdf->setX(90, $tstartY+5);
                $pdf->Cell(10,$tendY-($tstartY+5),"",0,1,'',true);
        }
        $endY = $pdf->getY();

        //Kundendaten
        $pdf->setXY(40, $startY);
        $pdf->SetFont('','B');
        $customer = $order->getCustomer();
        $pdf->Cell(50,5,utf8_decode($customer->getFirstname()." ".$customer->getLastname()),"R",1,'R',true);
        $pdf->SetFont('','');
        $pdf->setX(40);
        $pdf->MultiCell(50,5,utf8_decode($customer->getAddressStreet()."\n".$customer->getAddressZip()." ".$customer->getAddressCity()),"R","R",true);

        //Bestellnummer + Code128
        $pdf->setY($startY);
        $pdf->setX(10);
        $pdf->setFillColor($color);
        $pdf->Cell(30,10,"",1,1,'',true);
        $pdf->setFillColor(0);
        $pdf->Code128(15,$startY+2.5,$order->getOrderID(),20,5);
        $pdf->setX(10);
        $pdf->setFillColor($color);
        $pdf->SetFont('','B');
        $pdf->Cell(30,5,$order->getOrderID(),"T",1,'C',true);
        //$pdf->Ln();
        $pdf->setX(10);
        $pdf->Cell(80,$endY-($startY+15),"","R",1,"",true);
    }

    $orders = \rrshop\Order::getListObjects(1, 999,"","","state = 1");


    $pdf = new PDF_Code128();

    $pdf->AddPage();
    $pdf->setAutoPagebreak(True);
    $pdf->SetMargins(0, 0, 0);
    $pdf->SetFont('Arial','B',11);
    $pdf->setFillColor(0);
    $pdf->setTextColor(255);

    $pdf->setXY(10,20);
    $pdf->Cell(30,10,"Bestellnr.",1,0,'',true);
    $pdf->SetFont('','');
    $pdf->Cell(50,10,"Kunde",1,0,'',true);
    $pdf->Cell(10,10,"Pos.",1,0,'',true);
    $pdf->Cell(100,10,"Bestelldaten",1,1,'',true);

    $pdf->setTextColor(0);
    for ($i=0; $i < sizeof($orders); $i++) {
        if ($i%2 == 0) item($pdf, $orders[$i], 200);
        else item($pdf, $orders[$i], 250);
    }

    $pdf->Output("I");
    //print_r($orders);