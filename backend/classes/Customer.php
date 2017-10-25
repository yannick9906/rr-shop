<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 2017-10-25
     * Time: 10:39 PM
     */

    namespace rrshop;


    class Customer {
        private $firstname, $lastname, $email, $payment, $shipping;
        private $customerID;
        private $PDO;

        /**
         * Customer constructor.
         *
         * @param $firstname
         * @param $lastname
         * @param $email
         * @param $payment
         * @param $shipping
         * @param $customerID
         */
        public function __construct($firstname, $lastname, $email, $payment, $shipping, $customerID) {
            $this->firstname = $firstname;
            $this->lastname = $lastname;
            $this->email = $email;
            $this->payment = $payment;
            $this->shipping = $shipping;
            $this->customerID = $customerID;
            $this->PDO = new PDO_MYSQL();
        }

        public static function fromCustomerID($customerID) {

        }
    }