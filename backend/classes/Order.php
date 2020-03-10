<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;

    use PHPMailer\PHPMailer\PHPMailer;

    class Order implements \JsonSerializable {
        private $customer, $items, $timestamp;
        private $orderID, $orderNum, $payment, $shipping, $state, $note, $totalPrice, $shipID;
        private $pdo;

        /**
         * Order constructor.
         *
         * @param $orderID
         * @param $orderNum
         * @param $customer
         * @param $items
         * @param $payment
         * @param $shipping
         * @param $state
         * @param $note
         * @param $timestamp
         * @param $totalPrice
         * @param $shipID
         */
        public function __construct($orderID, $orderNum, $customer, $items, $payment, $shipping, $state, $note, $timestamp, $totalPrice, $shipID) {
            $this->orderID = $orderID;
            $this->customer = Customer::fromCustomerID(intval($customer));
            $this->items = $items;
            $this->payment = intval($payment);
            $this->state =intval($state);
            $this->shipping = $shipping;
            $this->note = $note;
            $this->timestamp = strtotime($timestamp);
            $this->orderNum = $orderNum;
            $this->totalPrice = $totalPrice;
            $this->shipID = $shipID;
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * @param $orderID
         * @return Order
         */
        public static function fromOrderID($orderID) {
            if(substr( $orderID, 0, 2 ) === "5a") {
                $pdo = new PDO_MYSQL();
                $res = $pdo->query("SELECT * FROM rrshop_orders WHERE orderNum = :oid", [":oid" => $orderID]);
                return new Order($res->orderID, $res->orderNum, $res->customer, $res->items, $res->payment, $res->shipping, $res->state, $res->note, $res->timestamp, $res->totalPrice, $res->shipID);
            } else {
                $pdo = new PDO_MYSQL();
                $res = $pdo->query("SELECT * FROM rrshop_orders WHERE orderID = :oid", [":oid" => $orderID]);
                return new Order($res->orderID, $res->orderNum, $res->customer, $res->items, $res->payment, $res->shipping, $res->state, $res->note, $res->timestamp, $res->totalPrice, $res->shipID);
            }
        }

        /**
         * @param Customer $customer
         * @param string   $items
         * @param int      $payment
         * @param int      $shipping
         * @param string   $note
         * @return Order
         */
        public static function createOrder($customer, $items, $payment, $shipping, $note, $orderPrice) {
            $pdo = new PDO_MYSQL();

            $res1 = $pdo->query("SELECT IFNULL( (SELECT orderID FROM rrshop_orders WHERE orderID >= ".date('Y')."000 ORDER BY timestamp DESC LIMIT 1), ".date('Y')."000) as orderID;",[]);
            $orderID = intval($res1->orderID)+1;
            //Create Order
            $pdo->queryInsert("rrshop_orders", [
                "orderID" => $orderID,
                "orderNum" => uniqid(),
                "customer" => $customer->getCustomerID(),
                "payment" => intval($payment),
                "shipping" => intval($shipping),
                "items" => json_encode($items),
                "totalPrice" => $orderPrice,
                "state" => $payment==2 ? 1:0,
                "note" => $note
            ]);
            $res = $pdo->query("SELECT orderID FROM rrshop_orders ORDER BY timestamp DESC LIMIT 1",[]);

            //Return Order
            if($res->orderID == $orderID) return self::fromOrderID($res->orderID);
            else return null;
        }

        /**
         * Returns all entries matching the search and the page
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $filter
         * @return array Normal dict array with dataO
         */
        public static function getList($page = 1, $pagesize = 75, $search = "", $filter = "") {
            $USORTING = [
                "timeAsc"  => "ORDER BY timestamp ASC",
                "idAsc"    => "ORDER BY orderID ASC",
                "timeDesc" => "ORDER BY timestamp DESC",
                "idDesc"   => "ORDER BY orderID DESC",
                "" => ""
            ];
            $OFILTERING = [
                "default"  => "state >= 0 and state < 6",
                "new"    => "state >= 0 and state <= 1",
                "ordered"    => "state >= 2 and state <= 3",
                "shipping"    => "state >= 4 and state <= 5",
                "completed" => "state = 6",
                "storno" => "state = -1",
                "all"   => "",
                "" => ""
            ];

            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_orders", $startElem, $endElem, ["orderID"], $search, $USORTING["idDesc"], $OFILTERING[$filter]);
            $hits = self::getListMeta($page, $pagesize, $search, $filter);
            while($row = $stmt->fetchObject()) {
                array_push($hits["orders"], [
                    "orderID" => $row->orderID,
                    "timestamp" => $row->timestamp,
                    "customer" => Customer::fromCustomerID($row->customer),
                    "state" => $row->state,
                    "payment" => $row->payment,
                    "shipping" => $row->shipping,
                    "totalPrice" => $row->totalPrice,
                    "shipID" => $row->shipID,
                    "check" => md5($row->orderID+$row->timestamp+$row->customer)
                ]);
            }
            return $hits;
        }

        /**
         * Returns the array stub for the getList() methods
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $filter
         * @return array
         */
        public static function getListMeta($page, $pagesize, $search, $filter) {
            $OFILTERING = [
                "default"  => "state >= 0 and state < 6",
                "new"    => "state >= 0 and state <= 1",
                "ordered"    => "state >= 2 and state <= 3",
                "shipping"    => "state >= 4 and state <= 5",
                "completed" => "state = 6",
                "storno" => "state = -1",
                "all"   => "state > -99",
                "" => "state > -99"
            ];
            $pdo = new PDO_MYSQL();
            if($search != "") $res = $pdo->query("select count(*) as size from rrshop_orders where lower(concat(orderID)) like lower(concat('%',:search,'%')) and ".$OFILTERING[$filter], [":search" => $search]);
            else $res = $pdo->query("select count(*) as size from rrshop_orders where ".$OFILTERING[$filter]);
            $size = $res->size;
            $maxpage = ceil($size / $pagesize);
            return [
                "size" => $size,
                "maxPage" => $maxpage,
                "page" => $page,
                "orders" => []
            ];
        }

        /**
         * Returns all entries matching the search and the page
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $sort
         *
         * @param string $where
         * @return Order[]
         */
        public static function getListObjects($page = 1, $pagesize = 75, $search = "", $sort = "", $where = "state != 3") {
            $USORTING = [
                "timeAsc"  => "ORDER BY timestamp ASC",
                "idAsc"    => "ORDER BY orderID ASC",
                "timeDesc" => "ORDER BY timestamp DESC",
                "idDesc"   => "ORDER BY orderID DESC",
                "" => ""
            ];

            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_orders", $startElem, $endElem, ["orderID"], $search, $USORTING[$sort], $where);
            $hits = [];
            while($row = $stmt->fetchObject()) {
                array_push($hits, Order::fromOrderID($row->orderID));
            }
            return $hits;
        }

        /**
         * Saves the Changes made to this object to the db
         */
        public function saveChanges() {
            $this->pdo->queryUpdate("rrshop_orders",
                ["state" => $this->state,
                 "items" => $this->items,
                 "payment" => $this->payment,
                 "shipping" => $this->shipping,
                 "note" => $this->note,
                 "totalPrice" => $this->totalPrice,
                 "shipID" => $this->shipID],
                "orderID = :oid",
                ["oid" => $this->orderID]
            );
        }

        /**
         *  HTML5 Notification to all subscribed admins
         */
        public function notifyAdmins() {
            User::sendOutNotifications(json_encode([
                "info"  => "statechange",
                "orderState" => 0,
                "customerName" => $this->customer->getFirstname()." ".$this->customer->getLastname(),
                "orderID" => $this->orderID,
                "orderPrice" => $this->totalPrice
            ]));
        }

        /**
         * Generate Invoice for the current order and save it
         *
         * @return string Invoice Path
         */
        public function saveInvoice() {
            $invoice = new Invoice($this->items, $this->orderID, $this->customer, $this->note, $this->timestamp, $this->totalPrice);
            $invoice->preparePDF();
            return $invoice->getPDFFile();
            //$invoice->showPDF();
        }

        /**
         * Send Email Notification to the Customer
         *
         * @throws \PHPMailer\PHPMailer\Exception
         */
        public function sendEmailToCustomer() {

            if($this->state == 0) {
                //Send Email
                $template = new \Template();
                $mail = new PHPMailer(true);

                $template->assign("orderID", $this->orderID);
                switch ($this->payment) {
                    case 0:
                        $template->assign("displayBar", "");
                        $template->assign("displayPaypal", "display: none;");
                        $template->assign("displayUberweisung", "display: none;");
                        break;
                    case 1:
                        $template->assign("displayBar", "display: none;");
                        $template->assign("displayPaypal", "display: none;");
                        $template->assign("displayUberweisung", "");
                        break;
                    case 2:
                        $template->assign("displayBar", "display: none;");
                        $template->assign("displayPaypal", "");
                        $template->assign("displayUberweisung", "display: none;");
                        break;
                }
                //$template->assign("displayPaypal", "");
                //$template->assign("displayUberweisung", "");
                //$template->assign("displayBar", "");

                $mail->setFrom("noreply@shop.rheinhessenriders.tk", "RheinhessenRiders Shop");
                $mail->addAddress($this->customer->getEmail(), $this->customer->getFirstname() . " " . $this->customer->getLastname());
                $mail->addEmbeddedImage('../../../img/reimann.jpg', 'reimann');
                $mail->addEmbeddedImage('../../../img/title.jpg', 'title');
                $mail->addAttachment("../../invoices/" . $this->orderID . "-rechnung.pdf", $this->orderID . "-rechnung.pdf");


                $mail->isHTML(true);
                //Todo add plain text version
                $mail->Subject = "RR Shop - Deine Bestellung #" . $this->orderID . " ist eingegangen.";
                $mail->Body = $template->parse("../../email.html");
                $mail->AltBody = "";

                $mail->send();
            }
            //TODO add other state update Mails
        }

        /**
         * @return mixed
         */
        public function getOrderNum() {
            return $this->orderNum;
        }

        /**
         * @param mixed $orderNum
         */
        public function setOrderNum($orderNum) {
            $this->orderNum = $orderNum;
        }

        /**
         * @return bool|Customer
         */
        public function getCustomer() {
            return $this->customer;
        }

        /**
         * @return mixed
         */
        public function getItems() {
            return $this->items;
        }

        /**
         * @return mixed
         */
        public function getOrderID() {
            return $this->orderID;
        }

        /**
         * @return int
         */
        public function getPayment() {
            return $this->payment;
        }

        /**
         * @return int
         */
        public function getState() {
            return $this->state;
        }

        /**
         * @return mixed
         */
        public function getEstDate() {
            return $this->estDate;
        }

        /**
         * @return mixed
         */
        public function getNote() {
            return $this->note;
        }

        /**
         * @param int $state
         */
        public function setState($state) {
            $this->state = $state;
        }

        /**
         * @param mixed $estDate
         */
        public function setEstDate($estDate) {
            $this->estDate = $estDate;
        }

        /**
         * @return mixed
         */
        public function getTimestamp() {
            return $this->timestamp;
        }

        /**
         * @param mixed $items
         */
        public function setItems($items) {
            $this->items = json_encode($items);
        }

        /**
         * @param int $payment
         */
        public function setPayment($payment) {
            $this->payment = $payment;
        }

        /**
         * @param mixed $note
         */
        public function setNote($note) {
            $this->note = $note;
        }

        /**
         * @return mixed
         */
        public function getShipping() {
            return $this->shipping;
        }

        /**
         * @param mixed $shipping
         */
        public function setShipping($shipping) {
            $this->shipping = $shipping;
        }

        /**
         * @return mixed
         */
        public function getTotalPrice() {
            return $this->totalPrice;
        }

        /**
         * @param mixed $totalPrice
         */
        public function setTotalPrice($totalPrice) {
            $this->totalPrice = $totalPrice;
        }

        /**
         * Specify dataO which should be serialized to JSON
         *
         * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed dataO which can be serialized by <b>json_encode</b>,
         * which is a value of any type other than a resource.
         * @since 5.4.0
         */
        public function jsonSerialize() {
            return [
                "orderID" => $this->orderID,
                "orderNum" => $this->orderNum,
                "state" => $this->state,
                "shipping" => $this->shipping,
                "payment" => $this->payment,
                "timestamp" => date("d. m. Y H:i",$this->timestamp),
                "customername" => $this->customer->getFirstname()." ".$this->customer->getLastname(),
                "customer" => $this->customer,
                "totalPrice" => $this->totalPrice,
                "note" => $this->note,
                "shipID" => $this->shipID,
                "items" => json_decode($this->items)
            ];
        }
    }