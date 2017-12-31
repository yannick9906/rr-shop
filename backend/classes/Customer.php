<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;


    class Customer implements \JsonSerializable {
        private $firstname, $lastname, $email;
        private $addressCity, $addressStreet, $addressZip;
        private $customerID;
        private $PDO;

        /**
         * Customer constructor.
         *
         * @param $firstname
         * @param $lastname
         * @param $email
         * @param $customerID
         */
        public function __construct($customerID, $firstname, $lastname, $email, $addressCity, $addressStreet, $addressZip) {
            $this->firstname = utf8_encode($firstname);
            $this->lastname = utf8_encode($lastname);
            $this->email = utf8_encode($email);
            $this->addressZip = $addressZip;
            $this->addressCity = utf8_encode($addressCity);
            $this->addressStreet = utf8_encode($addressStreet);
            $this->customerID = $customerID;
            $this->PDO = new PDO_MYSQL();
        }

        /**
         * @param $customerID
         * @return bool|Customer
         */
        public static function fromCustomerID($customerID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_customers WHERE customerID = :cid", [":cid" => $customerID]);
            if($customerID == $res->customerID) return new Customer($customerID, $res->firstname, $res->lastname, $res->email, $res->addressCity, $res->addressStreet, $res->addressZip);
            else return new Customer(-1, "Kunde", "nicht gefunden", "null@null.null", "null", "null 00", "00000");
        }

        /**
         * @param $customerEmail
         * @return bool|Customer
         */
        public static function checkEMail($customerEmail) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_customers WHERE email = :email", [":email" => $customerEmail]);
            if($customerEmail == $res->email) return new Customer($res->customerID, $res->firstname, $res->lastname, $customerEmail, $res->addressCity, $res->addressStreet, $res->addressZip);
            else return false;
        }

        /**
         * @param $firstname
         * @param $lastname
         * @param $email
         * @param $addressCity
         * @param $addressStreet
         * @param $addressZip
         * @return bool|Customer
         */
        public static function createNew($firstname, $lastname, $email, $addressCity, $addressStreet, $addressZip) {
            $pdo = new PDO_MYSQL();
            $pdo->queryInsert("rrshop_customers", [
                "firstname" => $firstname,
                "lastname" => $lastname,
                "email" => $email,
                "addressStreet" => $addressStreet,
                "addressCity" => $addressCity,
                "addressZip" => $addressZip
            ]);

            return self::checkEMail($email);
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
                "nameAsc"  => "ORDER BY lastname ASC",
                "idAsc"    => "ORDER BY customerID ASC",
                "nameDesc" => "ORDER BY lastname DESC",
                "idDesc"   => "ORDER BY customerID DESC",
                "" => ""
            ];

            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_customers", $startElem, $endElem, ["customerID", "firstname","lastname"], $search, $USORTING[$sort], "");
            $hits = self::getListMeta($page, $pagesize, $search);
            while($row = $stmt->fetchObject()) {
                array_push($hits["customers"], [
                    "customerID" => $row->customerID,
                    "firstname" => utf8_encode($row->firstname),
                    "lastname" => utf8_encode($row->lastname),
                    "email" => utf8_encode($row->email),
                    "addressStreet" => utf8_encode($row->addressStreet),
                    "addressZip" => $row->addressZip,
                    "addressCity" => utf8_encode($row->addressCity),
                    "check" => md5($row->customerID+$row->firstname+$row->lastname+$row->email+$row->addressZip)
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
            if($search != "") $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_customers where lower(concat(firstname,lastname,customerID)) like lower(concat('%',:search,'%'))", [":search" => $search]);
            else $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_customers");
            $size = $res->size;
            $maxpage = ceil($size / $pagesize);
            return [
                "size" => $size,
                "maxPage" => $maxpage,
                "page" => $page,
                "customers" => []
            ];
        }

        /**
         * @return int
         */
        public function getCustomerID() {
            return $this->customerID;
        }

        /**
         * @return string
         */
        public function getFirstname() {
            return $this->firstname;
        }

        /**
         * @return string
         */
        public function getLastname() {
            return $this->lastname;
        }

        /**
         * @return string
         */
        public function getEmail() {
            return $this->email;
        }

        /**
         * @return string
         */
        public function getAddressCity() {
            return $this->addressCity;
        }

        /**
         * @return string
         */
        public function getAddressStreet() {
            return $this->addressStreet;
        }

        /**
         * @return mixed
         */
        public function getAddressZip() {
            return $this->addressZip;
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
                "firstname" => $this->firstname,
                "lastname" => $this->lastname,
                "email" => $this->email,
                "addressStreet" => $this->addressStreet,
                "addressZip" => $this->addressZip,
                "addressCity" => $this->addressCity
            ];

        }
    }