<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;



    class Item {
        private $itemID, $itemName, $displayName, $invoiceName, $shipID;
        private $basePrice, $baseAmount, $description, $imageLink;
        private $pdo;

        /**
         * Item constructor.
         *
         * @param int $itemID
         * @param string $itemName
         * @param string $displayName
         * @param string $invoiceName
         * @param int $shipID
         * @param int $basePrice
         * @param int $baseAmount
         * @param string $description
         * @param string $imageLink
         */
        public function __construct($itemID, $itemName, $displayName, $invoiceName, $shipID, $basePrice, $baseAmount, $description, $imageLink) {
            $this->itemID = $itemID;
            $this->itemName = $itemName;
            $this->displayName = $displayName;
            $this->invoiceName = $invoiceName;
            $this->shipID = $shipID;
            $this->basePrice = $basePrice;
            $this->baseAmount = $baseAmount;
            $this->description = $description;
            $this->imageLink = $imageLink;
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * @param int $itemID
         * @return Item
         */
        public static function getItemByID($itemID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM rrshop_items WHERE itemID = :iid", [":iid" => $itemID]);
            return new Item($res->itemID, $res->itemName, $res->displayName, $res->invoiceName, $res->shipID, $res->basePrice, $res->baseAmount, $res->description, $res->imageLink);
        }

        /**
         * @param string $itemName
         * @return Item
         */
        public static function getItemByName($itemName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM rrshop_items WHERE itemName = :inm", [":inm" => $itemName]);
            return new Item($res->itemID, $res->itemName, $res->displayName, $res->invoiceName, $res->shipID, $res->basePrice, $res->baseAmount, $res->description, $res->imageLink);
        }

        /**
         * @return array
         */
        public static function getItems() {
            $pdo = new PDO_MYSQL();

            $stmt = $pdo->queryMulti("select * from rrshop_items order by itemID");
            $rows = array();
            while($r = $stmt->fetchObject()) {
                array_push($rows, $r);
            }
            return $rows;
        }

        public static function getItemFeatures($itemName) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("select * from rrshop_itemFeatures where itemID = (select itemID from rrshop_items where itemName = :itmNme limit 1) order by featureID",[":itmNme" => $itemName]);
            $rows = array();
            while($r = $stmt->fetchObject()) {
                array_push($rows, $r);
            }
            return $rows;
        }

        /**
         * @return int
         */
        public function getItemID() {
            return $this->itemID;
        }

        /**
         * @param int $itemID
         */
        public function setItemID($itemID) {
            $this->itemID = $itemID;
        }

        /**
         * @return string
         */
        public function getItemName() {
            return $this->itemName;
        }

        /**
         * @param string $itemName
         */
        public function setItemName($itemName) {
            $this->itemName = $itemName;
        }

        /**
         * @return string
         */
        public function getDisplayName() {
            return $this->displayName;
        }

        /**
         * @param string $displayName
         */
        public function setDisplayName($displayName) {
            $this->displayName = $displayName;
        }

        /**
         * @return string
         */
        public function getInvoiceName() {
            return $this->invoiceName;
        }

        /**
         * @param string $invoiceName
         */
        public function setInvoiceName($invoiceName) {
            $this->invoiceName = $invoiceName;
        }

        /**
         * @return int
         */
        public function getShipID() {
            return $this->shipID;
        }

        /**
         * @param int $shipID
         */
        public function setShipID($shipID) {
            $this->shipID = $shipID;
        }

        /**
         * @return int
         */
        public function getBasePrice() {
            return $this->basePrice;
        }

        /**
         * @param int $basePrice
         */
        public function setBasePrice($basePrice) {
            $this->basePrice = $basePrice;
        }

        /**
         * @return int
         */
        public function getBaseAmount() {
            return $this->baseAmount;
        }

        /**
         * @param int $baseAmount
         */
        public function setBaseAmount($baseAmount) {
            $this->baseAmount = $baseAmount;
        }

        /**
         * @return string
         */
        public function getDescription() {
            return $this->description;
        }

        /**
         * @param string $description
         */
        public function setDescription($description) {
            $this->description = $description;
        }

        /**
         * @return string
         */
        public function getImageLink() {
            return $this->imageLink;
        }

        /**
         * @param string $imageLink
         */
        public function setImageLink($imageLink) {
            $this->imageLink = $imageLink;
        }

        public function getTotalPrice() {
            return $this->amount * $this->price;
        }

        public function itemDataToInvoice($item, $rows = 2) {
            $thisItemFeatures = self::getItemFeatures($this->itemName);
            $invoiceString = "";

            for($j=0; $j < sizeof($thisItemFeatures); $j++) {
                if($j==0) $invoiceString .= $thisItemFeatures[$j]->invoiceName.": ";
                else $invoiceString .= "; ".$thisItemFeatures[$j]->invoiceName.": ";
                if($thisItemFeatures[$j]->featureType == "1") {
                    $invoiceString .= array_values($item['itemData'])[$j];
                } elseif($thisItemFeatures[$j]->featureType == "2") {
                    $needle = array_values($item['itemData'])[$j];
                    $haystack = json_decode($thisItemFeatures[$j]->possibleValues, true);
                    $invoiceString .= $haystack[$needle];
                }
            }
            if(strlen($invoiceString) < 64 && $rows >= 2) $invoiceString.="\n.";
            if(strlen($invoiceString) < 118 && $rows >= 3) $invoiceString.="\n.";
            return $invoiceString;
        }

        public static function checkPriceAndCorrect($items) {
            $itemData = self::getItems();
            $itemIDs = array_column($itemData, 'itemID');
            $corrected = $items;

            for($i=0; $i < sizeof($corrected); $i++) {
                $thisItem = $itemData[array_search($corrected[$i]['itemType'], $itemIDs)];
                $thisItemFeatures = self::getItemFeatures($thisItem->itemName);
                $generatedPrice = $thisItem->basePrice;

                for($j=0; $j < sizeof($thisItemFeatures); $j++) {
                    if($thisItemFeatures[$j]->featureType == "2") {
                        $needle = array_values($corrected[$i]['itemData'])[$j];
                        $haystack = json_decode($thisItemFeatures[$j]->possibleValues, true);
                        $index = array_search($needle,array_keys($haystack));
                        $addPrice = json_decode($thisItemFeatures[$j]->addPrice)[$index];
                        $generatedPrice += $addPrice;
                    }
                }

                $corrected[$i]['price'] = $generatedPrice*$corrected[$i]['amount'];
                //print_r($generatedPrice);
            }

            return array_values($corrected);
        }

        public static function addShipping($items, $shipAll) {
            $corrected = $items;
            $shipping = [0,0];
            $cost = 0;
            $totalCost = 0;
            $shipType = 'none';
            //Check for shipping[0]
            for($i=0; $i < sizeof($corrected); $i++) {
                $itemName = $corrected[$i]['itemName'];
                $totalCost += $corrected[$i]["price"];
                if($itemName == "rr_sticker") {
                    $shipping[0] = 1;
                } else if($shipAll && $itemName != "rr_shipping") {
                    $shipping[1] = 1;
                }
            }

            if($totalCost >= 50) {
                $cost = 0; $shipType = 'free';
            } elseif($shipping[0] == 0 and $shipping[1] == 1) {
                $cost = 5; $shipType = 'items';
            } elseif($shipping[0] == 1 and $shipping[1] == 1) {
                $cost = 5; $shipType = 'both';
            } elseif($shipping[0] == 1 and $shipping[1] == 0) {
                $cost = 1.5; $shipType = 'sticker';
            }

            array_push($corrected, [
                "itemType"=>99,
                "price"=>$cost,
                "amount"=>1,
                "itemName"=>"rr_shipping",
                "itemData"=>[
                    "shipType"=>$shipType
                ],
            ]);

            return array_values($corrected);
        }

        public static function getTotalPriceOfItems($items) {
            $totalPrice = 0;
            for($i=0; $i < sizeof($items); $i++) {
                $totalPrice += $items[$i]['price'];
            }
            return $totalPrice;
        }
    }