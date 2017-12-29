<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;



    class Item {
        private $Names = [1=>"RheinhessenRiders Hoodie",2=>"RheinhessenRiders Shirt",3=>"RheinhessenRiders Sticker"];
        private $Prices = [1=>30,2=>17,3=>1];
        private $Options = ["frontName"=>"Name auf der Front", "city"=>"Stadt", "size"=>"Größe", "color"=>"Farbe"];
        private $name, $amount, $itemData,$options,$price;

        /**
         * Item constructor.
         *
         * @param $type
         * @param $amount
         * @param $itemData
         */
        public function __construct($type, $amount, $itemData) {
            $this->name = $this->Names[$type];
            $this->price = $this->Prices[$type];
            $this->amount = $amount;
            $this->itemData = $itemData;
            foreach($itemData as $option => $value) {
                $this->options .= (sizeof($this->options)==0?"":"; ").$this->Options[$option].": ".strtoupper($value);
            }
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
    }