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
        private $Options = ["frontName"=>"Name auf der Front", "mugName"=>"Name auf der Tasse", "city"=>"Stadt", "size"=>"Größe", "color"=>"Farbe", "heart"=>"Herzschlag", "insta"=>"Instagram", "rightarm"=>"Druck Rechter Arm", "type"=>"Variante"];
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
            $shipping = [];
            for($i = 0; $i < sizeof($corrected); $i++) {
                switch ($corrected[$i]['itemType']){
                    case 1:
                        if($corrected[$i]['itemData']['rightarm'] == "JA") $corrected[$i]['price'] = 35;
                        else $corrected[$i]['price'] = 33;
                        array_push($shipping, 5);
                        break;
                    case 2:
                        $corrected[$i]['price'] = 22;
                        array_push($shipping, 5);
                        break;
                    case 3:
                        $corrected[$i]['price'] = 0.2;
                        array_push($shipping, 1.5);
                        break;
                    case 4:
                        unset($corrected[$i]);
                        break;
                    case 5:
                        if($corrected[$i]['itemData']['color'] == "weiss") $corrected[$i]['price'] = 12;
                        else $corrected[$i]['price'] = 14;
                        array_push($shipping, 5);
                        break;
                }
            }
            if(sizeof($shipping) != 0) array_push($corrected, [
                "itemType"=>4,
                "amount"=>1,
                "price"=>array_sum(array_unique($shipping)),
                "itemData"=>[]
            ]);
            return json_encode(array_values($corrected));
        }
    }