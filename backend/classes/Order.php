<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;


    class Order implements \JsonSerializable {
        private $customer, $items;
        private $orderID, $shipment, $payment, $state;
        private $pdo;

        /**
         * Order constructor.
         *
         * @param $orderID
         * @param $customer
         * @param $items
         * @param $shipment
         * @param $payment
         * @param $state
         */
        public function __construct($orderID, $customer, $items, $shipment, $payment, $state) {
            $this->orderID = $orderID;
            $this->customer = intval($customer);
            $this->items = $items;
            $this->shipment = intval($shipment);
            $this->payment = intval($payment);
            $this->state =intval($state);
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * @param $orderID
         * @return Order
         */
        public static function fromOrderID($orderID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM rrshop_orders WHERE orderID = :oid", [":oid" => $orderID]);
            return new Order($orderID, $res->customer, $res->items, $res->shipping, $res->payment, $res->state);
        }


        /**
         * Specify data which should be serialized to JSON
         *
         * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed data which can be serialized by <b>json_encode</b>,
         * which is a value of any type other than a resource.
         * @since 5.4.0
         */
        public function jsonSerialize() {
            return [
                "orderID" => $this->orderID,
                "state" => $this->state,
                "nextClose" => "31.12.",
                "payment" => $this->payment,
                "shipping" => $this->shipment
            ];
        }
    }