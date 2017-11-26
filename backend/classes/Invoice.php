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
        private $orderID, $customer;

        /**
         * Invoice constructor.
         *
         * @param string $items
         * @param int $orderID
         * @param Customer $customer
         */
        public function __construct($items, $orderID, $customer) {
            $this->items = json_decode(utf8_decode($items),true);
            $this->orderID = $orderID;
            $this->customer = $customer;
            $this->pdf = new \PDF_Code128();
        }

        public function preparePDF() {
            $this->pdf->AddPage();
            $this->pdf->AcceptPageBreak();
            $this->pdf->Image("../../../img/preview/MainzInv.png",60,10,60);
            $qrcode = new \QRcode('https://shop.rheinhessenriders.tk/backend/edit/#order-'.$this->orderID, 'H');
            $qrcode->disableBorder();
            $qrcode->displayFPDF($this->pdf, 10, 10, 50);
            $this->pdf->Code128(10, 60, $this->orderID, 50, 10);
            $this->pdf->SetFont('Arial','B',14);
            $this->pdf->Text(10,80,"Rechnungsnummer: ".$this->orderID);
            $this->pdf->SetFont("","",11);
            $this->pdf->SetXY(140,20);
            $name = utf8_decode($this->customer->getFirstname())." ".utf8_decode($this->customer->getLastname());
            $this->pdf->MultiCell(60,5,$name."\n".$this->customer->getEmail(),0,"R");

            $this->pdf->SetFont("","b",10);
            $this->pdf->setXY(10,95);
            $this->pdf->Cell(60,8,"Artikelname",1,0);
            $this->pdf->Cell(90,8,"Optionen",1,0);
            $this->pdf->Cell(20,8,"Menge",1,0);
            $this->pdf->Cell(20,8,"Preis",1,1);
            $totalPrice = 0;
            foreach ($this->items as $item) {
                $i = new Item($item['itemType'], $item['amount'], $item["itemData"]);
                $this->pdf->SetFont("","",10);
                $this->pdf->Cell(60,8,$i->getName(),1,0);
                $this->pdf->SetFont("","",8);
                $this->pdf->Cell(90,8,utf8_decode($i->getOptions()),1,0);
                $this->pdf->SetFont("","",10);
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
        }

        public function getPDFAttachment() {
            $this->pdf->Output("F", $this->orderID."-rechnung.pdf",false);
        }

        public function showPDF() {
            $this->pdf->Output("I");
        }
    }