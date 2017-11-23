<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;

    use Minishlink\WebPush\WebPush;
    use PHPMailer\PHPMailer\PHPMailer;

    class Order implements \JsonSerializable {
        private $customer, $items;
        private $orderID, $shipment, $payment, $state, $estDate;
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
        public function __construct($orderID, $customer, $items, $shipment, $payment, $state, $estDate) {
            $this->orderID = $orderID;
            $this->customer = Customer::fromCustomerID(intval($customer)); //Todo create customer instance
            $this->items = $items;
            $this->shipment = intval($shipment);
            $this->payment = intval($payment);
            $this->state =intval($state);
            $this->estDate = $estDate;
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * @param $orderID
         * @return Order
         */
        public static function fromOrderID($orderID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_orders WHERE orderID = :oid", [":oid" => $orderID]);
            return new Order($orderID, $res->customer, $res->items, $res->shipping, $res->payment, $res->state, $res->estDate);
        }

        /**
         * @param Customer $customer
         * @param string   $items
         * @param int      $payment
         * @param int      $shipment
         * @return Order
         */
        public static function createOrder($customer, $items, $payment, $shipment) {
            $pdo = new PDO_MYSQL();
            $template = new \Template();
            $mail = new PHPMailer(true);

            //Create Order
            $pdo->queryInsert("rrshop_orders", [
                "orderID" => uniqid(),
                "customer" => $customer->getCustomerID(),
                "shipping" => intval($shipment),
                "payment" => intval($payment),
                "items" => $items,
                "estDate" => "31.12."
            ]);
            $res = $pdo->query("SELECT orderID FROM db_302476_3.rrshop_orders ORDER BY timestamp DESC LIMIT 1",[]);

            //Todo Send Pushs
            $webPush = new WebPush(getAuth());
            //$webPush->sendNotification($endpoint, $payload, $userPublicKey, $userAuthToken));

            //Send Email
            $template->assign("orderID", $res->orderID);

            $mail->setFrom("noreply@shop.rheinhessenriders.tk", "RheinhessenRiders Shop");
            $mail->addAddress($customer->getEmail(),$customer->getFirstname()." ".$customer->getLastname());
            $mail->addEmbeddedImage('../../../img/reimann.jpg', 'reimann');    // Optional name
            $mail->addEmbeddedImage('../../../img/title.jpg', 'title');    // Optional name
            //Todo generate invoice and qr code

            $mail->isHTML(true);
            //Todo add plain text version
            $mail->Subject = "Deine Bestellung #".$res->orderID." ist eingegangen.";
            $mail->Body    = $template->parse("../../email.html");
            $mail->AltBody = "";

            $mail->send();
            //Return Order
            return self::fromOrderID($res->orderID);
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
                "nextClose" => $this->estDate,
                "payment" => $this->payment,
                "shipping" => $this->shipment,
                "customername" => $this->customer->getFirstname()." ".$this->customer->getLastname()
            ];
        }
    }