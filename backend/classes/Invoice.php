<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-11-26
     * Time: 04:53 PM
     */

    namespace rrshop;

    class Invoice {
        private $items, $pdf;
        private $orderID, $customer, $note;
        private $timestamp;

        /**
         * Invoice constructor.
         *
         * @param string   $items
         * @param int      $orderID
         * @param Customer $customer
         * @param string   $note
         * @param          $timestamp
         */
        public function __construct($items, $orderID, $customer, $note, $timestamp) {
            $this->items = json_decode(utf8_encode($items),true);
            //var_dump($this->items);
            $this->orderID = $orderID;
            $this->customer = $customer;
            $this->note = $note;
            $this->timestamp = $timestamp;
            $this->pdf = new \PDF_Code128();
        }

        public function preparePDF() {
            $this->pdf->AddPage();
            $this->pdf->AcceptPageBreak();
            $this->pdf->Image("/home/webpages/lima-city/ybook/store.rheinhessenriders/img/Shop-Logo.png",60,10,60);
            $qrcode = new \QRcode('https://shop.rheinhessenriders.tk/backend/#order-'.$this->orderID, 'M');
            $qrcode->disableBorder();
            $qrcode->displayFPDF($this->pdf, 10, 10, 50);
            $this->pdf->Code128(10, 60, $this->orderID, 50, 10);
            $this->pdf->SetFont('Arial','B',14);
            $this->pdf->Text(10,80,"Rechnungsnummer: ".$this->orderID." - ".date("d. m. Y",$this->timestamp));
            $this->pdf->SetFont("","",11);
            $this->pdf->SetXY(140,20);
            $name = utf8_decode($this->customer->getFirstname())." ".utf8_decode($this->customer->getLastname());
            $address = utf8_decode($this->customer->getAddressStreet())."\n".utf8_decode($this->customer->getAddressZip())." ".utf8_decode($this->customer->getAddressCity());
            $this->pdf->MultiCell(60,5,$name."\n".$address."\n".$this->customer->getEmail(),0,"R");

            $this->pdf->SetFont("","b",10);
            $this->pdf->setXY(10,95);
            $this->pdf->Cell(50,8,"Artikelname",1,0);
            $this->pdf->Cell(100,8,"Optionen",1,0);
            $this->pdf->Cell(20,8,"Menge",1,0);
            $this->pdf->Cell(20,8,"Preis",1,1);
            $totalPrice = 0;
            foreach ($this->items as $item) {
                $i = new Item($item['itemType'], $item['amount'], $item["itemData"], $item["price"]);
                $this->pdf->SetFont("","",10);
                $this->pdf->Cell(50,8,$i->getName(),1,0);
                $this->pdf->SetFont("Courier","",7);
                $currentX = $this->pdf->GetX();
                $currentY = $this->pdf->GetY();
                $this->pdf->MultiCell(100,4,utf8_decode($i->getOptions()),1);
                $this->pdf->SetXY($currentX+100, $currentY);
                $this->pdf->SetFont("Arial","",10);
                $this->pdf->Cell(20,8,$i->getAmount(),1,0,"R");
                $this->pdf->SetFont("","b");
                $this->pdf->Cell(20,8,$i->getTotalPrice()." EUR",1,1,"R");
                $totalPrice += $i->getTotalPrice();
            }
            $this->pdf->SetFont("","b",10);
            $this->pdf->SetFillColor(150,150,150);
            $this->pdf->setX(160);
            $this->pdf->Cell(20,8,"Gesamt",1,0,"R",true);
            $this->pdf->Cell(20,8,$totalPrice." EUR",1,1,"R",true);
            $this->pdf->Ln(16);
            $this->pdf->setX(10);
            $this->pdf->MultiCell(0,6,"Notiz: ".wordwrap(utf8_decode($this->note)), 1,1);
            return $totalPrice;
        }

        public function getPDFAttachment() {
            $this->pdf->Output("F", $this->orderID."-rechnung.pdf",false);
        }

        public function getPDFFile() {
            echo "/home/webpages/lima-city/ybook/store.rheinhessenriders/backend/invoices/".$this->orderID."-rechnung.pdf<br/>";
            $this->pdf->Output("F", "/home/webpages/lima-city/ybook/store.rheinhessenriders/backend/invoices/".$this->orderID."-rechnung.pdf",false);
        }

        public function showPDF() {
            $this->pdf->Output("I");
        }
    }