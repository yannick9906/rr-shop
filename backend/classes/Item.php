<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;



    class Item {
        private $Names = [1=>"RheinhessenRiders Hoodie",2=>"RheinhessenRiders Shirt",3=>"RheinhessenRiders Sticker",4=>"Versandkosten",5=>"RheinhessenRiders Tasse"];
        private $Options = ["frontName"=>"Name auf der Front", "mugName"=>"Name auf der Tasse", "city"=>"Stadt", "size"=>"Größe", "color"=>"Farbe", "heart"=>"Herzschlag", "insta"=>"Instagram", "rightarm"=>"Druck Rechter Arm"];
        private $name, $amount, $itemData,$options,$price;

        /**
         * Item constructor.
         *
         * @param $type
         * @param $amount
         * @param $itemData
         */
        public function __construct($type, $amount, $itemData, $price) {
            $this->name = $this->Names[$type];
            $this->price = $price;
            $this->amount = $amount;
            $this->itemData = $itemData;
            foreach($itemData as $option => $value) {
                $this->options .= (sizeof($this->options)==0?"":"; ").$this->Options[$option].": ".strtoupper($value);
            }
            if(strlen($this->options) < 64) $this->options.="\n.";
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
            $corrected = json_decode($items, true);
            for($i = 0; $i < sizeof($corrected); $i++) {
                switch ($corrected[$i]['itemType']){
                    case 1:
                        if($corrected[$i]['itemData']['rightarm'] == "JA") $corrected[$i]['price'] = 35;
                        else $corrected[$i]['price'] = 33;
                        break;
                    case 2:
                        $corrected[$i]['price'] = 22;
                        break;
                    case 3:
                        $corrected[$i]['price'] =1;
                        break;
                    case 4:
                        $corrected[$i]['price'] = 5;
                        break;
                    case 5:
                        if($corrected[$i]['itemData']['color'] == "weiss") $corrected[$i]['price'] = 12;
                        else $corrected[$i]['price'] = 14;
                        break;
                }
            }
            return json_encode($corrected);
        }
    }