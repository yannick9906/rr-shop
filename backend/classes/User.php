<?php
    /**
     * Created by PhpStorm.
     * User: yanni
     * Date: 26.09.2016
     * Time: 22:17
     */

    namespace rrshop;

    class User implements \JsonSerializable {
        private $pdo, $uID, $uName, $uPassHash, $uEmail;

        /**
         * User constructor.
         *
         * @param int    $uID
         * @param string $uName
         * @param string $uPassHash
         * @param string $uEmail
         */
        public function __construct($uID, $uName, $uPassHash, $uEmail) {
            $this->uID = $uID;
            $this->uName = utf8_encode($uName);
            $this->uPassHash = $uPassHash;
            $this->uEmail = $uEmail;
            $this->pdo = new PDO_MYSQL();
        }

        /**
         * Creates a new User Object from a give user ID
         *
         * @param int $uID
         * @return User
         */
        public static function fromUID($uID) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE uID = :uid", [":uid" => $uID]);
            return new User($res->uID, $res->username, $res->passhash, $res->email);
        }

        /**
         * Creates a new User Object from a give username
         *
         * @param string $uName
         * @return User
         */
        public static function fromUName($uName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE username = :uname", [":uname" => $uName]);
            return new User($res->uID, $res->username, $res->passhash, $res->email);
        }

        /**
         * Makes this class as an string to use for debug only
         *
         * @return string
         */
        public function __toString() {
            return
                "id:        ".$this->uID."\n".
                "usrname:   ".$this->uName."\n".
                "email:     ".$this->uEmail."\n";
        }

        /**
         * checks if a username is in the user db
         *
         * @param string $uName
         * @return bool
         */
        public static function doesUserNameExist($uName) {
            $pdo = new PDO_MYSQL();
            $res = $pdo->query("SELECT * FROM db_302476_3.rrshop_user WHERE username = :uname", [":uname" => $uName]);
            return isset($res->uID);
        }

        /**
         * Returns all entries matching the search and the page
         *
         * @param int    $page
         * @param int    $pagesize
         * @param string $search
         * @param string $sort
         *
         * @return array Normal dict array with data
         */
        public static function getList($page = 1, $pagesize = 75, $search = "", $sort = "") {
            $USORTING = [
                "nameAsc"  => "ORDER BY username ASC",
                "idAsc"    => "ORDER BY uID ASC",
                "nameDesc" => "ORDER BY username DESC",
                "idDesc"   => "ORDER BY uID DESC",
                "" => ""
            ];

            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_user", $startElem, $endElem, ["username"], $search, $USORTING[$sort], "uID >= 0");
            $hits = self::getListMeta($page, $pagesize, $search);
            while($row = $stmt->fetchObject()) {
                array_push($hits["users"], [
                    "uID" => $row->uID,
                    "username" => utf8_encode($row->username),
                    "email" => utf8_encode($row->email),
                    "check" => md5($row->uID+$row->username+$row->email)
                ]);
            }
            return $hits;
        }

        /**
         * @see getList()
         * but you'll get Objects instead of an array
         *
         * @param int $page
         * @param int $pagesize
         * @param string $search
         *
         * @return User[]
         */
        public static function getListObjects($page = 1, $pagesize = 9999999, $search = "") {
            $pdo = new PDO_MYSQL();
            $startElem = ($page-1) * $pagesize;
            $endElem = $pagesize;
            $stmt = $pdo->queryPagedList("rrshop_user", $startElem, $endElem, ["username"], $search, "", "uID >= 0");
            $hits = [];
            while($row = $stmt->fetchObject()) {
                array_push($hits, new User(
                        $row->uID,
                        $row->username,
                        $row->passHash,
                        $row->email)
                );
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
            if($search != "") $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_user where lower(concat(username)) like lower(concat('%',:search,'%')) and uID >= 0", [":search" => $search]);
            else $res = $pdo->query("select count(*) as size from db_302476_3.rrshop_user where uID >= 0");
            $size = $res->size;
            $maxpage = ceil($size / $pagesize);
            return [
                "size" => $size,
                "maxPage" => $maxpage,
                "page" => $page,
                "users" => []
            ];
        }

        /**
         * Deletes a user
         *
         * @return bool
         */
        public function delete() {
            return $this->pdo->query("DELETE FROM db_302476_3.rrshop_user WHERE uID = :uid", [":uid" => $this->uID]);
        }

        /**
         * Saves the Changes made to this object to the db
         */
        public function saveChanges() {
            $this->pdo->queryUpdate("rrshop_user",
                ["username" => utf8_decode($this->uName),
                 "passhash" => $this->uPassHash,
                 "email" => utf8_decode($this->uEmail)],
                "uID = :uid",
                ["uid" => $this->uID]
            );
        }

        /**
         * Creates a new user from the give attribs
         *
         * @param string $username
         * @param string $passwdhash
         * @param string $email
         */
        public static function createUser($username, $passwdhash, $email) {
            $pdo = new PDO_MYSQL();
            $pdo->queryInsert("rrshop_user",
                ["username" => utf8_decode($username),
                 "passhash" => $passwdhash,
                 "email" => utf8_decode($email)]
            );
        }

        /**
         * @return int
         */
        public function getUID() {
            return $this->uID;
        }

        /**
         * @return string
         */
        public function getUName() {
            return $this->uName;
        }

        /**
         * @param string $uName
         */
        public function setUName($uName) {
            $this->uName = $uName;
        }

        /**
         * @return string
         */
        public function getUPassHash() {
            return $this->uPassHash;
        }

        /**
         * @param string $uPassHash
         */
        public function setUPassHash($uPassHash) {
            $this->uPassHash = $uPassHash;
        }

        /**
         * @return string
         */
        public function getUEmail() {
            return $this->uEmail;
        }

        /**
         * @param string $uEmail
         */
        public function setUEmail($uEmail) {
            $this->uEmail = $uEmail;
        }


        /**
         * @param string $passHash
         * @return bool
         */
        public function comparePassHash($passHash) {
            return $this->uPassHash == $passHash;
        }

        /**
         * Specify data which should be serialized to JSON
         *
         * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
         * @return mixed data which can be serialized by <b>json_encode</b>,
         *        which is a value of any type other than a resource.
         * @since 5.4.0
         */
        function jsonSerialize() {
            return [
                "uID" => $this->uID,
                "username" => $this->uName,
                "email" => $this->uEmail
            ];
        }
    }