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
        private $orderID, $payment, $state, $estDate, $note;
        private $pdo;

        /**
         * Order constructor.
         *
         * @param $orderID
         * @param $customer
         * @param $items
         * @param $payment
         * @param $state
         * @param $estDate
         * @param $note
         */
        public function __construct($orderID, $customer, $items, $payment, $state, $estDate, $note) {
            $this->orderID = $orderID;
            $this->customer = Customer::fromCustomerID(intval($customer));
            $this->items = $items;
            $this->payment = intval($payment);
            $this->state =intval($state);
            $this->estDate = $estDate;
            $this->note = $note;
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * @param $orderID
         * @return Order
         */
        public static function fromOrderID($orderID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_orders WHERE orderID = :oid", [":oid" => $orderID]);
            return new Order($orderID, $res->customer, $res->items, $res->payment, $res->state, $res->estDate, $res->note);
        }

        /**
         * @param Customer $customer
         * @param string   $items
         * @param int      $payment
         * @param string   $note
         * @return Order
         * @throws \PHPMailer\PHPMailer\Exception
         */
        public static function createOrder($customer, $items, $payment, $note) {
            $pdo = new PDO_MYSQL();
            $template = new \Template();
            $mail = new PHPMailer(true);

            //Create Order
            $pdo->queryInsert("rrshop_orders", [
                "orderID" => uniqid(),
                "customer" => $customer->getCustomerID(),
                "payment" => intval($payment),
                "items" => $items,
                "note" => $note
            ], ", estDate = WEEK(ADDDATE(CURDATE(), INTERVAL 7 DAY),1)");
            $res = $pdo->query("SELECT orderID FROM db_302476_3.rrshop_orders ORDER BY timestamp DESC LIMIT 1",[]);

            //Send Email
            $template->assign("orderID", $res->orderID);
            switch ($payment) {
                case 0:
                    $template->assign("displayBar", "");
                    $template->assign("displayPaypal", "display: none;");
                    $template->assign("displayUberweisung", "display: none;");
                    break;
                case 1:
                    $template->assign("displayBar", "display: none;");
                    $template->assign("displayPaypal", "");
                    $template->assign("displayUberweisung", "display: none;");
                    break;
                case 2:
                    $template->assign("displayBar", "display: none;");
                    $template->assign("displayPaypal", "display: none;");
                    $template->assign("displayUberweisung", "");
                    break;
            }
            $invoice = new Invoice($items, $res->orderID, $customer, $note);
            $totalPrice = $invoice->preparePDF();
            $invoice->getPDFAttachment();

            User::sendOutNotifications(json_encode([
                "info"  => "statechange",
                "orderState" => 0,
                "customerName" => $customer->getFirstname()." ".$customer->getLastname(),
                "orderID" => $res->orderID,
                "orderPrice" => $totalPrice
            ]));

            $mail->setFrom("noreply@shop.rheinhessenriders.tk", "RheinhessenRiders Shop");
            $mail->addAddress($customer->getEmail(),$customer->getFirstname()." ".$customer->getLastname());
            $mail->addEmbeddedImage('../../../img/reimann.jpg', 'reimann');
            $mail->addEmbeddedImage('../../../img/title.jpg', 'title');
            $mail->addAttachment($res->orderID."-rechnung.pdf",$res->orderID."-rechnung.pdf");


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
         * Returns all entries matching the search and the page
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $sort
         *
         * @return array Normal dict array with dataO
         */
        public static function getList($page = 1, $pagesize = 75, $search = "", $sort = "") {
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
            $stmt = $pdo->queryPagedList("rrshop_orders", $startElem, $endElem, ["orderID"], $search, $USORTING[$sort], "");
            $hits = self::getListMeta($page, $pagesize, $search);
            while($row = $stmt->fetchObject()) {
                array_push($hits["orders"], [
                    "orderID" => $row->orderID,
                    "timestamp" => $row->timestamp,
                    "customer" => Customer::fromCustomerID($row->customer),
                    "state" => $row->state,
                    "payment" => $row->payment,
                    "check" => md5($row->orderID+$row->timestamp+$row->customer)
                ]);
            }
            return $hits;
        }

        /**
         * Returns the array stub for the getList() methods
         *
         * @param int $page
         * @param int $pagesize
         * @param string $search
         * @return array
         */
        public static function getListMeta($page, $pagesize, $search) {
            $pdo = new PDO_MYSQL();
            if($search != "") $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_orders where lower(concat(orderID)) like lower(concat('%',:search,'%'))", [":search" => $search]);
            else $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_orders");
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
                "state" => $this->state,
                "nextClose" => $this->estDate,
                "payment" => $this->payment,
                "customername" => $this->customer->getFirstname()." ".$this->customer->getLastname(),
                "customer" => $this->customer,
                "items" => json_decode($this->items)
            ];
        }
    }