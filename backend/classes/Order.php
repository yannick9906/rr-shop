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
            $this->customer = intval($customer); //Todo create customer instance
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
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_orders WHERE orderID = :oid", [":oid" => $orderID]);
            return new Order($orderID, $res->customer, $res->items, $res->shipping, $res->payment, $res->state);
        }

        /**
         * @param Customer $customer
         * @param string $items
         * @param int $payment
         * @param int $shipment
         */
        public static function createOrder($customer, $items, $payment, $shipment) {
            $pdo = new PDO_MYSQL();

            //Create Order
            $pdo->queryInsert("rrshop_orders", [
                "orderID" => uniqid(),
                "customer" => $customer->getCustomerID(),
                "shipping" => intval($shipment),
                "payment" => intval($payment),
                "items" => $items
            ]);

            //Todo Send Email
            //Todo Return Order ID
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
                "shipping" => $this->shipment/*,
                "customername" => $this->customer->getFirstname()." ".$this->customer->getLastname()
            */];
        }
    }