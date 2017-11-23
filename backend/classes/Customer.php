<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;


    class Customer {
        private $firstname, $lastname, $email;
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
        public function __construct($customerID, $firstname, $lastname, $email) {
            $this->firstname = utf8_encode($firstname);
            $this->lastname = utf8_encode($lastname);
            $this->email = utf8_encode($email);
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
            if($customerID == $res->customerID) return new Customer($customerID, $res->firstname, $res->lastname, $res->email);
            else return new Customer(-1, "Kunde", "nicht gefunden", "null@null.null");
        }

        /**
         * @param $customerEmail
         * @return bool|Customer
         */
        public static function checkEMail($customerEmail) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_customers WHERE email = :email", [":email" => $customerEmail]);
            if($customerEmail == $res->email) return new Customer($res->customerID, $res->firstname, $res->lastname, $customerEmail);
            else return false;
        }

        /**
         * @param $firstname
         * @param $lastname
         * @param $email
         * @return bool|Customer
         */
        public static function createNew($firstname, $lastname, $email) {
            $pdo = new PDO_MYSQL();
            $pdo->queryInsert("rrshop_customers", [
                "firstname" => $firstname,
                "lastname" => $lastname,
                "email" => $email
            ]);

            return self::checkEMail($email);
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
    }