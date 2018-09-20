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

            $stmt = $pdo->queryMulti("select * from rrshop_items");
            $rows = array();
            while($r = $stmt->fetchObject()) {
                array_push($rows, $r);
            }
            return $rows;
        }

        public static function getItemFeatures($itemName) {
            $pdo = new PDO_MYSQL();
            $stmt = $pdo->queryMulti("select * from rrshop_itemFeatures where itemID = (select itemID from rrshop_items where itemName = :itmNme limit 1)",[":itmNme" => $itemName]);
            $rows = array();
            while($r = $stmt->fetchObject()) {
                array_push($rows, $r);
            }
            return $rows;
        }
        
        /**
         * @return string
         */
        public function getName() {
            return $this->name;
        }

        /**
         * @return int
         */
        public function getAmount() {
            return $this->amount;
        }

        /**
         * @return array
         */
        public function getItemData() {
            return $this->itemData;
        }

        /**
         * @return string
         */
        public function getOptions() {
            return $this->options;
        }

        public function getTotalPrice() {
            return $this->amount * $this->price;
        }

        public static function checkPriceAndCorrect($items) {
            $itemData = self::getItems();
            $corrected = json_decode($items, true);

            for($i=0; $i < sizeof($corrected); $i++) {
                $thisItem = $itemData[$corrected[$i]['itemType']-1];
                $thisItemFeatures = self::getItemFeatures($thisItem->itemName);
                $generatedPrice = $thisItem->basePrice;
                //print_r($thisItem);

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

            return json_encode(array_values($corrected));
        }
    }